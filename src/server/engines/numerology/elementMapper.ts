import type { ElementVector } from "@/types/personalization";
import { ELEMENT_VECTORS } from "./constants";

const ZERO_VECTOR: ElementVector = {
  air: 0,
  water: 0,
  fire: 0,
  earth: 0,
  spirit: 0,
};

/** Map a numerology number to its element vector. Returns a copy. */
export function numberToVector(n: number): ElementVector {
  const vec = ELEMENT_VECTORS[n];
  if (vec === undefined) {
    return { ...ZERO_VECTOR };
  }
  return { ...vec };
}
