import { FUNCTIONS, QUESTIONS } from "./constants";

/**
 * Convert 16 Likert answers (1-5) into raw cognitive function scores.
 *
 * For each question: favored function gets v, opposite gets 6 - v.
 * Each function appears in exactly 4 questions, so scores range 4-20.
 */
export function scoreFunctions(answers: number[]): Record<string, number> {
  if (answers.length !== 16) {
    throw new Error(`Expected 16 answers, got ${answers.length}.`);
  }

  const scores: Record<string, number> = {};
  for (const fn of FUNCTIONS) {
    scores[fn] = 0;
  }

  for (let i = 0; i < answers.length; i++) {
    const v = answers[i];
    if (v < 1 || v > 5 || !Number.isInteger(v)) {
      throw new Error(`Answer ${i + 1} must be an integer 1-5, got ${v}.`);
    }

    const q = QUESTIONS[i];
    scores[q.favored] += v;
    scores[q.opposite] += 6 - v;
  }

  return scores;
}

/**
 * Normalize raw scores so they sum to 1.0.
 * If total is 0, returns uniform distribution (1/8 each).
 */
export function normalizeFunctions(
  raw: Record<string, number>,
): Record<string, number> {
  const total = Object.values(raw).reduce((sum, val) => sum + val, 0);

  if (total === 0) {
    const count = Object.keys(raw).length;
    const uniform: Record<string, number> = {};
    for (const fn of Object.keys(raw)) {
      uniform[fn] = 1.0 / count;
    }
    return uniform;
  }

  const normalized: Record<string, number> = {};
  for (const [fn, val] of Object.entries(raw)) {
    normalized[fn] = Math.round((val / total) * 1e6) / 1e6;
  }
  return normalized;
}
