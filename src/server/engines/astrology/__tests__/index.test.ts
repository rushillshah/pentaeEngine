import { describe, it, expect, vi } from "vitest";
import type { NatalChart } from "../constants";

const ELEMENTS = ["air", "water", "fire", "earth", "spirit"] as const;

// Mock chartService before importing the module under test
vi.mock("../chartService", () => ({
  computeNatalChart: vi.fn(),
}));

import { run } from "../index";
import { computeNatalChart } from "../chartService";

const mockComputeNatalChart = vi.mocked(computeNatalChart);

const SAMPLE_CHART: NatalChart = {
  Sun: { sign: "Aries", house: 1 },
  Moon: { sign: "Cancer", house: 4 },
  Ascendant: { sign: "Leo" },
  Mercury: { sign: "Gemini", house: 3 },
  Venus: { sign: "Taurus", house: 2 },
  Mars: { sign: "Scorpio", house: 8 },
  Jupiter: { sign: "Sagittarius", house: 9 },
  Saturn: { sign: "Capricorn", house: 10 },
  Uranus: { sign: "Aquarius", house: 11 },
  Neptune: { sign: "Pisces", house: 12 },
  Pluto: { sign: "Scorpio", house: 8 },
};

describe("run", () => {
  it("returns a vector summing to ~1.0 from a mocked chart", async () => {
    mockComputeNatalChart.mockResolvedValue(SAMPLE_CHART);

    const vec = await run(1992, 7, 23, 14, 30, 25.2, 55.3);
    const sum = ELEMENTS.reduce((acc, el) => acc + vec[el], 0);
    expect(sum).toBeCloseTo(1.0, 3);
  });

  it("returns all 5 element keys as numbers", async () => {
    mockComputeNatalChart.mockResolvedValue(SAMPLE_CHART);

    const vec = await run(1992, 7, 23, 14, 30, 25.2, 55.3);
    for (const el of ELEMENTS) {
      expect(vec).toHaveProperty(el);
      expect(typeof vec[el]).toBe("number");
    }
  });

  it("returns non-negative values", async () => {
    mockComputeNatalChart.mockResolvedValue(SAMPLE_CHART);

    const vec = await run(1992, 7, 23, 14, 30, 25.2, 55.3);
    for (const el of ELEMENTS) {
      expect(vec[el]).toBeGreaterThanOrEqual(0);
    }
  });

  it("propagates errors from chartService", async () => {
    mockComputeNatalChart.mockRejectedValue(new Error("Astrology API not configured"));

    await expect(run(1992, 7, 23, 14, 30, 25.2, 55.3)).rejects.toThrow(
      "Astrology API not configured",
    );
  });
});
