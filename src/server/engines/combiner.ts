import type { ElementVector } from "@/types/personalization";

const ELEMENTS = ["air", "water", "fire", "earth", "spirit"] as const;

export const MODULE_WEIGHTS: Record<string, number> = {
  numerology: 0.33,
  mbti: 0.33,
  astrology: 0.34,
};

export const FALLBACK_WEIGHTS: Record<string, number> = {
  numerology: 0.5,
  mbti: 0.5,
};

/**
 * Weighted average of multiple element vectors, normalized to sum = 1.0.
 * Rounds each element to 4 decimal places.
 * Returns uniform 0.2 each if all values are zero.
 */
export function combineVectors(
  vectors: Record<string, ElementVector>,
  weights: Record<string, number>,
): ElementVector {
  const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);

  const combined: Record<string, number> = {
    air: 0,
    water: 0,
    fire: 0,
    earth: 0,
    spirit: 0,
  };

  for (const [moduleName, vec] of Object.entries(vectors)) {
    const w = weights[moduleName] / totalWeight;
    for (const el of ELEMENTS) {
      combined[el] += vec[el] * w;
    }
  }

  const total = ELEMENTS.reduce((sum, el) => sum + combined[el], 0);

  if (total === 0) {
    return { air: 0.2, water: 0.2, fire: 0.2, earth: 0.2, spirit: 0.2 };
  }

  return {
    air: Math.round((combined.air / total) * 1e4) / 1e4,
    water: Math.round((combined.water / total) * 1e4) / 1e4,
    fire: Math.round((combined.fire / total) * 1e4) / 1e4,
    earth: Math.round((combined.earth / total) * 1e4) / 1e4,
    spirit: Math.round((combined.spirit / total) * 1e4) / 1e4,
  };
}
