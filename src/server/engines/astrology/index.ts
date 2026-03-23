import type { ElementVector } from "@/types/personalization";
import { computeNatalChart } from "./chartService";
import { chartToElementVector } from "./elementMapper";

/** Compute a normalized 5-element vector from birth data. */
export async function run(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  lat: number,
  lng: number,
): Promise<ElementVector> {
  const chart = await computeNatalChart(year, month, day, hour, minute, lat, lng);
  return chartToElementVector(chart);
}
