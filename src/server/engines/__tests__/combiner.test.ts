import { describe, it, expect } from "vitest";
import { combineVectors, MODULE_WEIGHTS, FALLBACK_WEIGHTS } from "../combiner";
import type { ElementVector } from "@/types/personalization";

const ELEMENTS = ["air", "water", "fire", "earth", "spirit"] as const;

describe("combineVectors", () => {
  it("combines 3 vectors at 33/33/34 and sums to ~1.0", () => {
    const vectors: Record<string, ElementVector> = {
      numerology: { air: 0.4, water: 0.1, fire: 0.3, earth: 0.1, spirit: 0.1 },
      mbti: { air: 0.1, water: 0.3, fire: 0.1, earth: 0.4, spirit: 0.1 },
      astrology: { air: 0.2, water: 0.2, fire: 0.2, earth: 0.2, spirit: 0.2 },
    };

    const result = combineVectors(vectors, MODULE_WEIGHTS);
    const sum = ELEMENTS.reduce((acc, el) => acc + result[el], 0);
    expect(sum).toBeCloseTo(1.0, 3);
  });

  it("combines 2 vectors at 50/50 (fallback weights)", () => {
    const vectors: Record<string, ElementVector> = {
      numerology: { air: 0.5, water: 0.0, fire: 0.5, earth: 0.0, spirit: 0.0 },
      mbti: { air: 0.0, water: 0.5, fire: 0.0, earth: 0.5, spirit: 0.0 },
    };

    const result = combineVectors(vectors, FALLBACK_WEIGHTS);
    const sum = ELEMENTS.reduce((acc, el) => acc + result[el], 0);
    expect(sum).toBeCloseTo(1.0, 3);

    // Equal weights + symmetric inputs → each contributing element should be equal
    expect(result.air).toBeCloseTo(result.water, 3);
    expect(result.fire).toBeCloseTo(result.earth, 3);
  });

  it("returns uniform 0.2 when all inputs are zero", () => {
    const vectors: Record<string, ElementVector> = {
      numerology: { air: 0, water: 0, fire: 0, earth: 0, spirit: 0 },
      mbti: { air: 0, water: 0, fire: 0, earth: 0, spirit: 0 },
      astrology: { air: 0, water: 0, fire: 0, earth: 0, spirit: 0 },
    };

    const result = combineVectors(vectors, MODULE_WEIGHTS);
    for (const el of ELEMENTS) {
      expect(result[el]).toBe(0.2);
    }
  });

  it("returns all non-negative values", () => {
    const vectors: Record<string, ElementVector> = {
      numerology: { air: 0.8, water: 0.05, fire: 0.05, earth: 0.05, spirit: 0.05 },
      mbti: { air: 0.05, water: 0.8, fire: 0.05, earth: 0.05, spirit: 0.05 },
      astrology: { air: 0.05, water: 0.05, fire: 0.05, earth: 0.05, spirit: 0.8 },
    };

    const result = combineVectors(vectors, MODULE_WEIGHTS);
    for (const el of ELEMENTS) {
      expect(result[el]).toBeGreaterThanOrEqual(0);
    }
  });

  it("rounds to 4 decimal places", () => {
    const vectors: Record<string, ElementVector> = {
      numerology: { air: 0.333, water: 0.333, fire: 0.334, earth: 0, spirit: 0 },
      mbti: { air: 0.5, water: 0.25, fire: 0.25, earth: 0, spirit: 0 },
    };

    const result = combineVectors(vectors, FALLBACK_WEIGHTS);
    for (const el of ELEMENTS) {
      const decimals = result[el].toString().split(".")[1] ?? "";
      expect(decimals.length).toBeLessThanOrEqual(4);
    }
  });
});
