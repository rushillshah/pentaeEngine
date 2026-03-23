import type { ElementVector } from "@/types/personalization";

export const LETTER_MAP: Record<string, number> = {
  A: 1, J: 1, S: 1,
  B: 2, K: 2, T: 2,
  C: 3, L: 3, U: 3,
  D: 4, M: 4, V: 4,
  E: 5, N: 5, W: 5,
  F: 6, O: 6, X: 6,
  G: 7, P: 7, Y: 7,
  H: 8, Q: 8, Z: 8,
  I: 9, R: 9,
};

export const VOWELS: ReadonlySet<string> = new Set(["A", "E", "I", "O", "U"]);

export const MASTER_NUMBERS: ReadonlySet<number> = new Set([11, 22, 33]);

export const WEIGHTS: Record<string, number> = {
  life_path: 0.5,
  expression: 0.3,
  soul_urge: 0.2,
};

export const ELEMENT_VECTORS: Record<number, ElementVector> = {
  1:  { air: 0,   water: 0,   fire: 1,   earth: 0,   spirit: 0   },
  2:  { air: 0,   water: 1,   fire: 0,   earth: 0,   spirit: 0   },
  3:  { air: 1,   water: 0,   fire: 0,   earth: 0,   spirit: 0   },
  4:  { air: 0,   water: 0,   fire: 0,   earth: 1,   spirit: 0   },
  5:  { air: 0.4, water: 0,   fire: 0.6, earth: 0,   spirit: 0   },
  6:  { air: 0,   water: 0.5, fire: 0,   earth: 0.5, spirit: 0   },
  7:  { air: 0,   water: 0,   fire: 0,   earth: 0,   spirit: 1   },
  8:  { air: 0,   water: 0,   fire: 0.5, earth: 0.5, spirit: 0   },
  9:  { air: 0,   water: 0.5, fire: 0,   earth: 0,   spirit: 0.5 },
  11: { air: 0.4, water: 0,   fire: 0,   earth: 0,   spirit: 0.6 },
  22: { air: 0,   water: 0,   fire: 0,   earth: 0.6, spirit: 0.4 },
  33: { air: 0,   water: 0,   fire: 0.6, earth: 0,   spirit: 0.4 },
};
