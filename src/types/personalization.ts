import type {
  CountryCode,
  ElementCode,
  ModuleCode,
  NarrativeSource,
  SessionStatus,
} from "./enums";

/** Quintessence scores + narrative are embedded for simplicity. */
export interface PersonalizationSession {
  id: number;
  anonymous_user_id: string;
  status: SessionStatus;
  country: CountryCode | null;
  consent_given: boolean;
  consent_at: Date | null;

  // Quintessence (populated after all modules complete)
  air_score: number | null;
  water_score: number | null;
  fire_score: number | null;
  earth_score: number | null;
  spirit_score: number | null;
  dominant_element: ElementCode | null;
  weights_used: Record<string, number> | null;

  // Narrative
  narrative_source: NarrativeSource | null;
  narrative_text: string | null;

  started_at: Date;
  completed_at: Date | null;
  abandoned_at: Date | null;
}

export interface ElementVector {
  air: number;
  water: number;
  fire: number;
  earth: number;
  spirit: number;
}

export interface PersonalizationModuleResponse {
  id: number;
  session_id: number;
  module: ModuleCode;
  input_payload: Record<string, unknown> | null;
  output_vector: ElementVector | null;
  status: "COMPLETED" | "FAILED";
  completed_at: Date | null;
  created_at: Date;
}

export interface PersonalizationRecommendation {
  id: number;
  session_id: number;
  country: CountryCode | null;
  created_at: Date;
}

export interface PersonalizationRecommendationItem {
  id: number;
  recommendation_id: number;
  product_id: number;
  rank: number;
  reason_code: string | null;
}
