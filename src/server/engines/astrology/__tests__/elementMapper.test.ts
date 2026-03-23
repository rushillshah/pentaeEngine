import { describe, it, expect } from "vitest";
import { signToElement, chartToElementVector } from "../elementMapper";
import type { NatalChart } from "../constants";

describe("signToElement", () => {
  it("maps Aries to fire", () => {
    expect(signToElement("Aries")).toBe("fire");
  });

  it("maps Pisces to water", () => {
    expect(signToElement("Pisces")).toBe("water");
  });

  it("maps Gemini to air", () => {
    expect(signToElement("Gemini")).toBe("air");
  });

  it("maps Taurus to earth", () => {
    expect(signToElement("Taurus")).toBe("earth");
  });

  it("throws on unknown sign", () => {
    expect(() => signToElement("Unknown")).toThrow("Unknown zodiac sign: Unknown");
  });
});

/** Helper: build a chart where every placement has the same sign. */
function makeUniformChart(sign: string, house = 1): NatalChart {
  const placement = { sign, house };
  return {
    Sun: placement,
    Moon: placement,
    Ascendant: { sign },
    Mercury: placement,
    Venus: placement,
    Mars: placement,
    Jupiter: placement,
    Saturn: placement,
    Uranus: placement,
    Neptune: placement,
    Pluto: placement,
  };
}

const ELEMENTS = ["air", "water", "fire", "earth", "spirit"] as const;

describe("chartToElementVector", () => {
  it("returns a vector that sums to ~1.0", () => {
    const chart = makeUniformChart("Aries");
    const vec = chartToElementVector(chart);
    const sum = ELEMENTS.reduce((acc, el) => acc + vec[el], 0);
    expect(sum).toBeCloseTo(1.0, 3);
  });

  it("all-fire chart puts most weight into fire", () => {
    const chart = makeUniformChart("Aries");
    const vec = chartToElementVector(chart);
    expect(vec.fire).toBeGreaterThan(vec.air);
    expect(vec.fire).toBeGreaterThan(vec.water);
    expect(vec.fire).toBeGreaterThan(vec.earth);
  });

  it("all-water chart puts most weight into water", () => {
    const chart = makeUniformChart("Cancer");
    const vec = chartToElementVector(chart);
    expect(vec.water).toBeGreaterThan(vec.fire);
    expect(vec.water).toBeGreaterThan(vec.air);
    expect(vec.water).toBeGreaterThan(vec.earth);
  });

  it("Sun in Pisces produces spirit > 0", () => {
    const chart = makeUniformChart("Aries");
    const chartWithPiscesSun: NatalChart = {
      ...chart,
      Sun: { sign: "Pisces", house: 1 },
    };
    const vec = chartToElementVector(chartWithPiscesSun);
    expect(vec.spirit).toBeGreaterThan(0);
  });

  it("stacks all spirit bonuses correctly", () => {
    // Sun in Pisces (+2.0), Moon in Sagittarius (+2.0), Ascendant in Aquarius (+2.0)
    // Neptune in Pisces (spirit sign +1.5) in house 12 (+1.5)
    // 3+ planets in house 12 (+1.0) — Neptune, Mercury, Venus in house 12
    const chart: NatalChart = {
      Sun: { sign: "Pisces", house: 1 },
      Moon: { sign: "Sagittarius", house: 2 },
      Ascendant: { sign: "Aquarius" },
      Mercury: { sign: "Aries", house: 12 },
      Venus: { sign: "Aries", house: 12 },
      Mars: { sign: "Aries", house: 3 },
      Jupiter: { sign: "Aries", house: 4 },
      Saturn: { sign: "Aries", house: 5 },
      Uranus: { sign: "Aries", house: 6 },
      Neptune: { sign: "Pisces", house: 12 },
      Pluto: { sign: "Aries", house: 8 },
    };

    const vec = chartToElementVector(chart);

    // Total spirit bonus = 2.0 + 2.0 + 2.0 + 1.5 + 1.5 + 1.0 = 10.0
    // This should make spirit the largest or a substantial portion
    expect(vec.spirit).toBeGreaterThan(0);

    // Verify total still sums to 1.0
    const sum = ELEMENTS.reduce((acc, el) => acc + vec[el], 0);
    expect(sum).toBeCloseTo(1.0, 3);
  });

  it("returns no spirit when no spirit bonuses apply", () => {
    // All Aries (fire sign), no planets in house 12, Neptune not in spirit sign
    const chart = makeUniformChart("Aries", 1);
    const vec = chartToElementVector(chart);
    expect(vec.spirit).toBe(0);
  });

  it("returns all non-negative values", () => {
    const chart = makeUniformChart("Libra");
    const vec = chartToElementVector(chart);
    for (const el of ELEMENTS) {
      expect(vec[el]).toBeGreaterThanOrEqual(0);
    }
  });
});
