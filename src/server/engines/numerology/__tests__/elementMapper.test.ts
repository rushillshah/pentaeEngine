import { describe, it, expect } from "vitest";
import { numberToVector } from "../elementMapper";

describe("numberToVector", () => {
  it("returns pure fire for 1", () => {
    expect(numberToVector(1)).toEqual({
      air: 0,
      water: 0,
      fire: 1,
      earth: 0,
      spirit: 0,
    });
  });

  it("returns pure spirit for 7", () => {
    expect(numberToVector(7)).toEqual({
      air: 0,
      water: 0,
      fire: 0,
      earth: 0,
      spirit: 1,
    });
  });

  it("returns mixed vector for 5", () => {
    expect(numberToVector(5)).toEqual({
      air: 0.4,
      water: 0,
      fire: 0.6,
      earth: 0,
      spirit: 0,
    });
  });

  it("returns master number vector for 11", () => {
    expect(numberToVector(11)).toEqual({
      air: 0.4,
      water: 0,
      fire: 0,
      earth: 0,
      spirit: 0.6,
    });
  });

  it("returns all zeros for unknown number", () => {
    expect(numberToVector(99)).toEqual({
      air: 0,
      water: 0,
      fire: 0,
      earth: 0,
      spirit: 0,
    });
  });

  it("returns a copy, not a reference", () => {
    const a = numberToVector(1);
    const b = numberToVector(1);
    a.fire = 0;
    expect(b.fire).toBe(1);
  });
});
