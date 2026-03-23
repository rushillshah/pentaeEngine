import type { ElementVector } from "@/types/personalization";
import { mixProfiles } from "./aggregator";
import { getExpression, getLifePath, getSoulUrge } from "./calculator";
import { numberToVector } from "./elementMapper";

/** Compute a blended element vector from date of birth and full name. */
export function run(dob: string, fullName: string): ElementVector {
  const lifePath = getLifePath(dob);
  const expression = getExpression(fullName);
  const soulUrge = getSoulUrge(fullName);

  const lpVec = numberToVector(lifePath);
  const expVec = numberToVector(expression);
  const suVec = soulUrge !== null ? numberToVector(soulUrge) : null;

  return mixProfiles(lpVec, expVec, suVec);
}
