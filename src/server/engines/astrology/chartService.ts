import type { NatalChart, PlanetPlacement } from "./constants";
import { PLANET_LIST } from "./constants";

const DEFAULT_API_URL = "https://json.freeastrologyapi.com/western-horoscope";

/**
 * Estimate UTC offset from longitude.
 * Each 15 degrees of longitude roughly corresponds to 1 hour offset.
 * This is a coarse approximation — sufficient for the external API.
 */
function estimateTimezone(lng: number): number {
  return Math.round(lng / 15);
}

interface FreeAstrologyPlanet {
  sign: string;
  house: number;
}

interface FreeAstrologyResponse {
  [key: string]: FreeAstrologyPlanet | unknown;
}

/**
 * Normalize planet name from the API response to our internal key.
 * The API returns keys like "sun", "moon", etc. — we need "Sun", "Moon", etc.
 */
function normalizePlanetKey(apiKey: string): string {
  return apiKey.charAt(0).toUpperCase() + apiKey.slice(1).toLowerCase();
}

/**
 * Compute a natal chart from birth data via FreeAstrologyAPI.
 *
 * Uses ASTROLOGY_API_URL env var if set, otherwise the default endpoint.
 * Requires ASTROLOGY_API_KEY to be set.
 */
export async function computeNatalChart(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  lat: number,
  lng: number,
): Promise<NatalChart> {
  const apiKey = process.env.ASTROLOGY_API_KEY;
  if (!apiKey) {
    throw new Error("Astrology API not configured");
  }

  const apiUrl = process.env.ASTROLOGY_API_URL || DEFAULT_API_URL;
  const timezone = estimateTimezone(lng);

  const requestBody = {
    year,
    month,
    day,
    hour,
    minute,
    latitude: lat,
    longitude: lng,
    timezone,
    settings: {
      observation_point: "geocentric",
      ayanamsha: "tropical",
      house_system: "Placidus",
    },
  };

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(
      `Astrology API returned ${response.status}: ${response.statusText}`,
    );
  }

  const data: FreeAstrologyResponse = await response.json();
  return parseNatalChart(data);
}

/**
 * Parse the FreeAstrologyAPI response into our NatalChart type.
 *
 * The API returns planet data keyed by lowercase name. Each planet has
 * a `sign` (e.g., "Leo") and `house` (integer 1-12). The Ascendant
 * only has a sign, no house.
 */
function parseNatalChart(data: FreeAstrologyResponse): NatalChart {
  const chart: Record<string, PlanetPlacement | { sign: string }> = {};

  // Parse Ascendant (sign only, no house)
  const ascendantData = findPlanetData(data, "Ascendant");
  if (!ascendantData || typeof ascendantData.sign !== "string") {
    throw new Error("Astrology API response missing Ascendant data");
  }
  chart.Ascendant = { sign: ascendantData.sign };

  // Parse each planet (sign + house)
  for (const planet of PLANET_LIST) {
    const planetData = findPlanetData(data, planet);
    if (
      !planetData ||
      typeof planetData.sign !== "string" ||
      typeof planetData.house !== "number"
    ) {
      throw new Error(`Astrology API response missing ${planet} data`);
    }
    chart[planet] = { sign: planetData.sign, house: planetData.house };
  }

  return chart as NatalChart;
}

/**
 * Find planet data in the API response, trying multiple key formats.
 * The API may return keys as "sun", "Sun", "SUN", etc.
 */
function findPlanetData(
  data: FreeAstrologyResponse,
  planet: string,
): FreeAstrologyPlanet | undefined {
  const lower = planet.toLowerCase();
  const normalized = normalizePlanetKey(planet);

  for (const key of Object.keys(data)) {
    if (
      key === planet ||
      key === lower ||
      key === normalized ||
      key.toLowerCase() === lower
    ) {
      const value = data[key];
      if (typeof value === "object" && value !== null) {
        return value as FreeAstrologyPlanet;
      }
    }
  }
  return undefined;
}
