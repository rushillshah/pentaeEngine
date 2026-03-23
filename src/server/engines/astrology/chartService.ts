import type { NatalChart } from "./constants";

/**
 * Compute a natal chart from birth data via an external astrology API.
 *
 * The actual API integration will be completed when a provider is chosen.
 * For now this validates that the required env vars are present and throws
 * a clear error if they are missing.
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
  const apiUrl = process.env.ASTROLOGY_API_URL;

  if (!apiKey || !apiUrl) {
    throw new Error("Astrology API not configured");
  }

  // TODO: call external API when provider is chosen
  throw new Error("Astrology API integration not yet implemented");
}
