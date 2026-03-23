import type { ElementVector } from "@/types/personalization";
import { functionsToElements } from "./elementMapper";
import { normalizeFunctions, scoreFunctions } from "./scorer";

/** Compute a 5-element vector from 8 MBTI Likert answers (1-5). */
export function run(answers: number[]): ElementVector {
  const raw = scoreFunctions(answers);
  const normalized = normalizeFunctions(raw);
  return functionsToElements(normalized);
}
