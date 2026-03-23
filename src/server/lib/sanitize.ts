const HTML_TAG_PATTERN = /<[^>]*>/g;
const VALID_NAME_PATTERN = /^[a-zA-Z\s\-'\.]+$/;
const DOB_FORMAT_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

const PROTOTYPE_KEYS = new Set(["__proto__", "constructor", "prototype"]);

/** Strip HTML tags, trim, and truncate to maxLength. */
export function sanitizeString(input: string, maxLength: number = 500): string {
  const stripped = input.replace(HTML_TAG_PATTERN, "");
  const trimmed = stripped.trim();
  return trimmed.slice(0, maxLength);
}

/** Validate name: letters, spaces, hyphens, apostrophes, periods only. Max 200 chars. */
export function isValidName(name: string): boolean {
  const sanitized = sanitizeString(name, 200);
  if (sanitized.length === 0) return false;
  return VALID_NAME_PATTERN.test(sanitized);
}

/** Validate DOB is a real date in the past, year 1900-current. Returns parsed Date or null. */
export function isValidDob(dob: string): Date | null {
  const match = DOB_FORMAT_PATTERN.exec(dob);
  if (!match) return null;

  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const day = parseInt(match[3], 10);

  if (month < 1 || month > 12) return null;
  if (day < 1 || day > 31) return null;
  if (year < 1900) return null;

  const currentYear = new Date().getFullYear();
  if (year > currentYear) return null;

  // Construct date and verify components match to catch invalid days (e.g. Feb 30)
  const parsed = new Date(year, month - 1, day);
  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }

  // Must not be in the future
  const now = new Date();
  now.setHours(23, 59, 59, 999);
  if (parsed.getTime() > now.getTime()) return null;

  return parsed;
}

/** Guard against NaN, Infinity, -Infinity. */
export function isFiniteNumber(val: unknown): val is number {
  return typeof val === "number" && Number.isFinite(val);
}

/** Recursively remove __proto__, constructor, prototype keys from parsed JSON. */
export function stripPrototypeKeys<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => stripPrototypeKeys(item)) as T;
  }

  const result: Record<string, unknown> = {};
  for (const key of Object.keys(obj as Record<string, unknown>)) {
    if (PROTOTYPE_KEYS.has(key)) continue;
    result[key] = stripPrototypeKeys((obj as Record<string, unknown>)[key]);
  }
  return result as T;
}
