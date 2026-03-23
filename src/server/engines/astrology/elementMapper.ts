import type { ElementVector } from "@/types/personalization";
import {
  ELEMENTS,
  NEPTUNE_12TH_HOUSE_BONUS,
  NEPTUNE_SPIRIT_SIGN_BONUS,
  type NatalChart,
  PLANET_WEIGHTS,
  SIGN_ELEMENTS,
  SPIRIT_SIGNS,
  STELLIUM_12TH_HOUSE_BONUS,
  STELLIUM_THRESHOLD,
  SUN_MOON_ASC_SPIRIT_BONUS,
} from "./constants";

/** Look up the classical element for a zodiac sign. Throws on unknown sign. */
export function signToElement(sign: string): string {
  const element = SIGN_ELEMENTS[sign];
  if (element === undefined) {
    throw new Error(`Unknown zodiac sign: ${sign}`);
  }
  return element;
}

/** Count how many planets (excluding Ascendant) occupy a given house. */
function countPlanetsInHouse(chart: NatalChart, houseNumber: number): number {
  let count = 0;
  for (const [key, placement] of Object.entries(chart)) {
    if (key === "Ascendant") continue;
    if ((placement as { house?: number }).house === houseNumber) {
      count += 1;
    }
  }
  return count;
}

/**
 * Calculate Spirit bonus points from special placements.
 *
 * Rules:
 *   - Sun/Moon/Ascendant in Pisces, Sagittarius, or Aquarius: +2.0 each
 *   - Neptune in a spirit sign: +1.5
 *   - Neptune in 12th house: +1.5
 *   - 3+ planets in 12th house: +1.0
 */
function computeSpiritBonus(chart: NatalChart): number {
  let bonus = 0.0;

  for (const key of ["Sun", "Moon", "Ascendant"] as const) {
    const sign = chart[key].sign;
    if (SPIRIT_SIGNS.has(sign)) {
      bonus += SUN_MOON_ASC_SPIRIT_BONUS;
    }
  }

  const neptune = chart.Neptune;
  if (SPIRIT_SIGNS.has(neptune.sign)) {
    bonus += NEPTUNE_SPIRIT_SIGN_BONUS;
  }
  if (neptune.house === 12) {
    bonus += NEPTUNE_12TH_HOUSE_BONUS;
  }

  if (countPlanetsInHouse(chart, 12) >= STELLIUM_THRESHOLD) {
    bonus += STELLIUM_12TH_HOUSE_BONUS;
  }

  return bonus;
}

/**
 * Convert a natal chart into a normalized 5-element vector.
 *
 * 1. For each planet/point in PLANET_WEIGHTS, look up sign -> element, add weight.
 * 2. Add spirit bonuses from special placements.
 * 3. Normalize so all values sum to 1.0 (uniform 0.2 if all zero).
 */
export function chartToElementVector(chart: NatalChart): ElementVector {
  const raw: Record<string, number> = {
    air: 0,
    water: 0,
    fire: 0,
    earth: 0,
    spirit: 0,
  };

  // Step 1: weighted planet contributions
  for (const [pointName, weight] of Object.entries(PLANET_WEIGHTS)) {
    const placement = chart[pointName as keyof NatalChart];
    if (placement === undefined) continue;
    const element = signToElement(placement.sign);
    raw[element] += weight;
  }

  // Step 2: spirit bonuses
  raw.spirit += computeSpiritBonus(chart);

  // Step 3: normalize to sum = 1.0
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
