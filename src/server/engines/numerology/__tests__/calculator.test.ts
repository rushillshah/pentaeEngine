import { describe, it, expect } from "vitest";
import {
  cleanString,
  reduceNumber,
  getLifePath,
  getExpression,
  getSoulUrge,
} from "../calculator";

describe("cleanString", () => {
  it("strips non-alpha characters and uppercases", () => {
    expect(cleanString("John Doe 123")).toBe("JOHNDOE");
  });

  it("handles empty string", () => {
    expect(cleanString("")).toBe("");
  });

  it("handles already uppercase", () => {
    expect(cleanString("ABC")).toBe("ABC");
  });

  it("handles only non-alpha characters", () => {
    expect(cleanString("123 !@#")).toBe("");
  });
});

describe("reduceNumber", () => {
  it("reduces 32 to 5", () => {
    expect(reduceNumber(32)).toBe(5);
  });

  it("preserves master number 33", () => {
    expect(reduceNumber(33)).toBe(33);
  });

  it("preserves master number 11", () => {
    expect(reduceNumber(11)).toBe(11);
  });

  it("returns single digit as-is", () => {
    expect(reduceNumber(7)).toBe(7);
  });

  it("reduces 0 to 0", () => {
    expect(reduceNumber(0)).toBe(0);
  });

  it("reduces large number correctly", () => {
    // 99 -> 18 -> 9
    expect(reduceNumber(99)).toBe(9);
  });
});

describe("getLifePath", () => {
  it("returns 33 for 1992-07-23", () => {
    expect(getLifePath("1992-07-23")).toBe(33);
  });

  it("returns 5 for 1990-06-25", () => {
    expect(getLifePath("1990-06-25")).toBe(5);
  });

  it("throws on empty string", () => {
    expect(() => getLifePath("")).toThrow("Invalid date of birth");
  });

  it("throws on non-digit string", () => {
    expect(() => getLifePath("no-digits")).toThrow("Invalid date of birth");
  });
});

describe("getExpression", () => {
  it("computes expression number for a name", () => {
    const result = getExpression("John Doe");
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(33);
  });

  it("throws on empty name", () => {
    expect(() => getExpression("123")).toThrow("Invalid name");
  });
});

describe("getSoulUrge", () => {
  it("computes soul urge from vowels", () => {
    const result = getSoulUrge("John Doe");
    expect(result).not.toBeNull();
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result!).toBeLessThanOrEqual(33);
  });

  it("returns null when no vowels present", () => {
    expect(getSoulUrge("bcdfg")).toBeNull();
  });
});
