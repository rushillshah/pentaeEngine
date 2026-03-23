import { LETTER_MAP, MASTER_NUMBERS, VOWELS } from "./constants";

/** Strip non-alpha characters and uppercase. */
export function cleanString(s: string): string {
  return s.replace(/[^a-zA-Z]/g, "").toUpperCase();
}

/** Sum digits repeatedly until single digit or master number (11/22/33). */
export function reduceNumber(n: number): number {
  let value = Math.abs(n);
  while (value > 9 && !MASTER_NUMBERS.has(value)) {
    let sum = 0;
    while (value > 0) {
      sum += value % 10;
      value = Math.floor(value / 10);
    }
    value = sum;
  }
  return value;
}

/** Life path number from date of birth (YYYY-MM-DD). */
export function getLifePath(dob: string): number {
  const digits = dob.replace(/\D/g, "");
  if (digits.length === 0) {
    throw new Error("Invalid date of birth: no digits found");
  }
  const digitSum = digits.split("").reduce((sum, d) => sum + Number(d), 0);
  return reduceNumber(digitSum);
}

/** Expression number from full name (all letters mapped and summed). */
export function getExpression(fullName: string): number {
  const cleaned = cleanString(fullName);
  if (cleaned.length === 0) {
    throw new Error("Invalid name: no alphabetic characters found");
  }
  const letterSum = cleaned
    .split("")
    .reduce((sum, ch) => sum + (LETTER_MAP[ch] ?? 0), 0);
  return reduceNumber(letterSum);
}

/** Soul urge number from vowels in full name. Returns null if no vowels. */
export function getSoulUrge(fullName: string): number | null {
  const cleaned = cleanString(fullName);
  const vowelLetters = cleaned.split("").filter((ch) => VOWELS.has(ch));
  if (vowelLetters.length === 0) {
    return null;
  }
  const vowelSum = vowelLetters.reduce(
    (sum, ch) => sum + (LETTER_MAP[ch] ?? 0),
    0,
  );
  return reduceNumber(vowelSum);
}
