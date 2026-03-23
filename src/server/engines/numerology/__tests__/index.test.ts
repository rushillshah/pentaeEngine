import { describe, it, expect } from "vitest";
import { run } from "../index";

const ELEMENTS = ["air", "water", "fire", "earth", "spirit"] as const;

describe("run", () => {
  it("returns an ElementVector with all 5 keys", () => {
    const result = run("1992-07-23", "John Doe");
    for (const el of ELEMENTS) {
      expect(result).toHaveProperty(el);
      expect(typeof result[el]).toBe("number");
    }
  });

  it("returns values that sum close to 1.0", () => {
    const result = run("1992-07-23", "John Doe");
    const sum = ELEMENTS.reduce((acc, el) => acc + result[el], 0);
    expect(sum).toBeCloseTo(1.0, 2);
  });

  it("returns non-negative values", () => {
    const result = run("1992-07-23", "John Doe");
    for (const el of ELEMENTS) {
      expect(result[el]).toBeGreaterThanOrEqual(0);
    }
  });

  it("produces different results for different inputs", () => {
    const a = run("1992-07-23", "John Doe");
    const b = run("1985-01-15", "Alice Smith");
    const same = ELEMENTS.every((el) => a[el] === b[el]);
    expect(same).toBe(false);
  });

  it("throws on invalid date", () => {
    expect(() => run("", "John Doe")).toThrow();
  });

  it("throws on invalid name", () => {
    expect(() => run("1992-07-23", "123")).toThrow();
  });
});
