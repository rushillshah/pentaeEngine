import { describe, it, expect } from "vitest";
import { functionsToElements } from "../elementMapper";

describe("functionsToElements", () => {
  it("returns pure spirit for pure Ni input", () => {
    const normalized = {
      Ni: 1.0, Ne: 0, Si: 0, Se: 0, Ti: 0, Te: 0, Fi: 0, Fe: 0,
    };
    expect(functionsToElements(normalized)).toEqual({
      air: 0, water: 0, fire: 0, earth: 0, spirit: 1,
    });
  });

  it("returns pure earth for pure Si input", () => {
    const normalized = {
      Ni: 0, Ne: 0, Si: 1.0, Se: 0, Ti: 0, Te: 0, Fi: 0, Fe: 0,
    };
    expect(functionsToElements(normalized)).toEqual({
      air: 0, water: 0, fire: 0, earth: 1, spirit: 0,
    });
  });

  it("returns pure air for pure Ti input", () => {
    const normalized = {
      Ni: 0, Ne: 0, Si: 0, Se: 0, Ti: 1.0, Te: 0, Fi: 0, Fe: 0,
    };
    expect(functionsToElements(normalized)).toEqual({
      air: 1, water: 0, fire: 0, earth: 0, spirit: 0,
    });
  });

  it("returns pure water for pure Fi input", () => {
    const normalized = {
      Ni: 0, Ne: 0, Si: 0, Se: 0, Ti: 0, Te: 0, Fi: 1.0, Fe: 0,
    };
    expect(functionsToElements(normalized)).toEqual({
      air: 0, water: 1, fire: 0, earth: 0, spirit: 0,
    });
  });

  it("returns split fire/spirit for pure Ne input", () => {
    const normalized = {
      Ni: 0, Ne: 1.0, Si: 0, Se: 0, Ti: 0, Te: 0, Fi: 0, Fe: 0,
    };
    expect(functionsToElements(normalized)).toEqual({
      air: 0, water: 0, fire: 0.5, earth: 0, spirit: 0.5,
    });
  });

  it("sums to 1.0 for mixed input", () => {
    const normalized = {
      Ni: 0.125, Ne: 0.125, Si: 0.125, Se: 0.125,
      Ti: 0.125, Te: 0.125, Fi: 0.125, Fe: 0.125,
    };
    const result = functionsToElements(normalized);
    const total = result.air + result.water + result.fire + result.earth + result.spirit;
    expect(total).toBeCloseTo(1.0, 3);
  });

  it("returns 0.2 each when all inputs are zero", () => {
    const normalized = {
      Ni: 0, Ne: 0, Si: 0, Se: 0, Ti: 0, Te: 0, Fi: 0, Fe: 0,
    };
    expect(functionsToElements(normalized)).toEqual({
      air: 0.2, water: 0.2, fire: 0.2, earth: 0.2, spirit: 0.2,
    });
  });
});
