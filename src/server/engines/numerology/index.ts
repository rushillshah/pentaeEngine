import type { ElementVector } from "@/types/personalization";
import { mixProfiles } from "./aggregator";
import { getExpression, getLifePath, getSoulUrge } from "./calculator";
import { numberToVector } from "./elementMapper";

export interface NumerologyResult {
  elementVector: ElementVector;
  lifePath: number;
  expression: number;
  soulUrge: number | null;
}

/** Compute a blended element vector from date of birth and full name. */
export function run(dob: string, fullName: string): NumerologyResult {
  const lifePath = getLifePath(dob);
  const expression = getExpression(fullName);
  const soulUrge = getSoulUrge(fullName);

  const lpVec = numberToVector(lifePath);
  const expVec = numberToVector(expression);
  const suVec = soulUrge !== null ? numberToVector(soulUrge) : null;

  const elementVector = mixProfiles(lpVec, expVec, suVec);
  return { elementVector, lifePath, expression, soulUrge };
}
