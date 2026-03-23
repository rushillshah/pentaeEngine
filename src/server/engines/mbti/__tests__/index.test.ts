import { describe, it, expect } from "vitest";
import { run } from "../index";

describe("run", () => {
  it("returns a vector summing to ~1.0 for extreme answers", () => {
    const result = run([5, 1, 5, 1, 5, 1, 5, 1]);
    const total = result.air + result.water + result.fire + result.earth + result.spirit;
    expect(total).toBeCloseTo(1.0, 3);
  });

  it("returns balanced vector for all-neutral answers", () => {
    // All 3s: every function scores 6, uniform weights, balanced elements
    const result = run([3, 3, 3, 3, 3, 3, 3, 3]);
    const total = result.air + result.water + result.fire + result.earth + result.spirit;
    expect(total).toBeCloseTo(1.0, 3);

    // With uniform function weights, each element should be non-zero
    expect(result.air).toBeGreaterThan(0);
    expect(result.water).toBeGreaterThan(0);
    expect(result.fire).toBeGreaterThan(0);
    expect(result.earth).toBeGreaterThan(0);
    expect(result.spirit).toBeGreaterThan(0);
  });

  it("throws for invalid inputs", () => {
    expect(() => run([1, 2, 3])).toThrow("Expected 8 answers");
    expect(() => run([0, 3, 3, 3, 3, 3, 3, 3])).toThrow("must be an integer 1-5");
  });

  it("heavily favors spirit+air for Ni+Ti-dominant answers", () => {
    // High Ni (Q1=5), low Se (Q2=1), neutral Ne/Si, high Ti (Q5=5), low Fi (Q6=1), neutral Te/Fe
    const result = run([5, 1, 3, 3, 5, 1, 3, 3]);
    // Ni -> spirit, Ti -> air should dominate
    expect(result.spirit).toBeGreaterThan(result.fire);
    expect(result.air).toBeGreaterThan(result.water);
  });
});
