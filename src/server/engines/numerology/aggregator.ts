import type { ElementVector } from "@/types/personalization";
import { WEIGHTS } from "./constants";

const ELEMENTS = ["air", "water", "fire", "earth", "spirit"] as const;

/**
 * Weighted blend of life path, expression, and soul urge vectors.
 * LP 50%, Expression 30%, Soul Urge 20%.
 * If suVec is null, reweight LP and Expression proportionally.
 */
export function mixProfiles(
  lpVec: ElementVector,
  expVec: ElementVector,
  suVec: ElementVector | null,
): ElementVector {
  let lpWeight: number;
  let expWeight: number;
  let suWeight: number;

  if (suVec === null) {
    const totalWithout = WEIGHTS.life_path + WEIGHTS.expression;
    lpWeight = WEIGHTS.life_path / totalWithout;
    expWeight = WEIGHTS.expression / totalWithout;
    suWeight = 0;
  } else {
    lpWeight = WEIGHTS.life_path;
    expWeight = WEIGHTS.expression;
    suWeight = WEIGHTS.soul_urge;
  }

  const result: ElementVector = { air: 0, water: 0, fire: 0, earth: 0, spirit: 0 };

  for (const el of ELEMENTS) {
    const blended =
      lpVec[el] * lpWeight +
      expVec[el] * expWeight +
      (suVec !== null ? suVec[el] * suWeight : 0);
    result[el] = Math.round(blended * 10000) / 10000;
  }

  return result;
}
