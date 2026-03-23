import { describe, it, expect } from "vitest";
import { normalizeFunctions, scoreFunctions } from "../scorer";

describe("scoreFunctions", () => {
  it("scores extreme answers correctly", () => {
    const scores = scoreFunctions([5, 1, 5, 1, 5, 1, 5, 1]);

    // Q1: favored=Ni(5), opposite=Se(1). Q2: favored=Se(1), opposite=Ni(5)
    // Ni = 5 + 5 = 10, Se = 1 + 1 = 2
    expect(scores.Ni).toBe(10);
    expect(scores.Se).toBe(2);
    // Q3: favored=Ne(5), opposite=Si(1). Q4: favored=Si(1), opposite=Ne(5)
    expect(scores.Ne).toBe(10);
    expect(scores.Si).toBe(2);
    // Q5: favored=Ti(5), opposite=Fi(1). Q6: favored=Fi(1), opposite=Ti(5)
    expect(scores.Ti).toBe(10);
    expect(scores.Fi).toBe(2);
    // Q7: favored=Te(5), opposite=Fe(1). Q8: favored=Fe(1), opposite=Te(5)
    expect(scores.Te).toBe(10);
    expect(scores.Fe).toBe(2);
  });

  it("scores neutral answers (all 3s) to 6 each", () => {
    const scores = scoreFunctions([3, 3, 3, 3, 3, 3, 3, 3]);
    for (const fn of Object.keys(scores)) {
      expect(scores[fn]).toBe(6);
    }
  });

  it("throws on wrong answer count", () => {
    expect(() => scoreFunctions([1, 2, 3])).toThrow("Expected 8 answers, got 3.");
    expect(() => scoreFunctions([])).toThrow("Expected 8 answers, got 0.");
  });

  it("throws on out-of-range answer", () => {
    expect(() => scoreFunctions([0, 3, 3, 3, 3, 3, 3, 3])).toThrow(
      "Answer 1 must be an integer 1-5, got 0.",
    );
    expect(() => scoreFunctions([3, 3, 3, 3, 3, 3, 3, 6])).toThrow(
      "Answer 8 must be an integer 1-5, got 6.",
    );
  });

  it("throws on non-integer answer", () => {
    expect(() => scoreFunctions([1.5, 3, 3, 3, 3, 3, 3, 3])).toThrow(
      "Answer 1 must be an integer 1-5, got 1.5.",
    );
  });

  it("returns all 8 functions", () => {
    const scores = scoreFunctions([3, 3, 3, 3, 3, 3, 3, 3]);
    expect(Object.keys(scores).sort()).toEqual(
      ["Fe", "Fi", "Ne", "Ni", "Se", "Si", "Te", "Ti"],
    );
  });
});

describe("normalizeFunctions", () => {
  it("normalizes scores to sum to 1.0", () => {
    const raw = { Ni: 10, Ne: 2, Si: 10, Se: 2, Ti: 10, Te: 2, Fi: 10, Fe: 2 };
    const normalized = normalizeFunctions(raw);
    const total = Object.values(normalized).reduce((s, v) => s + v, 0);
    expect(total).toBeCloseTo(1.0, 5);
  });

  it("returns uniform distribution when total is 0", () => {
    const raw = { Ni: 0, Ne: 0, Si: 0, Se: 0, Ti: 0, Te: 0, Fi: 0, Fe: 0 };
    const normalized = normalizeFunctions(raw);
    for (const val of Object.values(normalized)) {
      expect(val).toBe(0.125);
    }
  });

  it("preserves proportions", () => {
    const raw = { Ni: 10, Ne: 2, Si: 10, Se: 2, Ti: 10, Te: 2, Fi: 10, Fe: 2 };
    const normalized = normalizeFunctions(raw);
    expect(normalized.Ni).toBeCloseTo(10 / 48, 5);
    expect(normalized.Ne).toBeCloseTo(2 / 48, 5);
  });

  it("rounds to 6 decimal places", () => {
    const raw = { Ni: 1, Ne: 1, Si: 1, Se: 0, Ti: 0, Te: 0, Fi: 0, Fe: 0 };
    const normalized = normalizeFunctions(raw);
    // 1/3 = 0.333333...
    expect(normalized.Ni).toBe(0.333333);
  });
});
