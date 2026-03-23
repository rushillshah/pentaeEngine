import type { ElementVector } from "@/types/personalization";

// ---------- Types ----------

export interface PlanetPlacement {
  sign: string;
  house: number;
}

export interface NatalChart {
  Sun: PlanetPlacement;
  Moon: PlanetPlacement;
  Ascendant: { sign: string };
  Mercury: PlanetPlacement;
  Venus: PlanetPlacement;
  Mars: PlanetPlacement;
  Jupiter: PlanetPlacement;
  Saturn: PlanetPlacement;
  Uranus: PlanetPlacement;
  Neptune: PlanetPlacement;
  Pluto: PlanetPlacement;
}

// ---------- Sign → Element mapping (full names for external API) ----------

export const SIGN_ELEMENTS: Record<string, string> = {
  Aries: "fire",
  Leo: "fire",
  Sagittarius: "fire",
  Taurus: "earth",
  Virgo: "earth",
  Capricorn: "earth",
  Gemini: "air",
  Libra: "air",
  Aquarius: "air",
  Cancer: "water",
  Scorpio: "water",
  Pisces: "water",
};

// ---------- Planets ----------

export const PLANET_LIST = [
  "Sun",
  "Moon",
  "Mercury",
  "Venus",
  "Mars",
  "Jupiter",
  "Saturn",
  "Uranus",
  "Neptune",
  "Pluto",
] as const;

export const PLANET_WEIGHTS: Record<string, number> = {
  Sun: 3.0,
  Moon: 3.0,
  Ascendant: 3.0,
  Mercury: 1.5,
  Venus: 1.5,
  Mars: 1.5,
  Jupiter: 1.0,
  Saturn: 1.0,
  Uranus: 0.5,
  Neptune: 0.5,
  Pluto: 0.5,
};

// ---------- Spirit bonus rules ----------

export const SPIRIT_SIGNS = new Set(["Pisces", "Sagittarius", "Aquarius"]);

export const SUN_MOON_ASC_SPIRIT_BONUS = 2.0;
export const NEPTUNE_SPIRIT_SIGN_BONUS = 1.5;
export const NEPTUNE_12TH_HOUSE_BONUS = 1.5;
export const STELLIUM_12TH_HOUSE_BONUS = 1.0;
export const STELLIUM_THRESHOLD = 3;

// ---------- Shared element list ----------

export const ELEMENTS = ["air", "water", "fire", "earth", "spirit"] as const;
