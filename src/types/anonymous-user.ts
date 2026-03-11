import type { CountryCode, CountrySource } from "./enums";

export interface AnonymousUser {
  id: string; // UUID — stored in cookie
  created_at: Date;
}

export interface UserCountryPreference {
  id: number;
  anonymous_user_id: string;
  detected_country: CountryCode | null;
  selected_country: CountryCode;
  source: CountrySource;
  created_at: Date;
  updated_at: Date;
}
