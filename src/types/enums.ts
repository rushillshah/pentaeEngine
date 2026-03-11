export type CountryCode = "IN" | "AE";
export type CurrencyCode = "INR" | "AED";
export type ElementCode = "AIR" | "WATER" | "FIRE" | "EARTH" | "SPIRIT";
export type ProductTypeCode = "HERO" | "ACCENT" | "CHARM";
export type CartStatus = "ACTIVE" | "ABANDONED";
export type OrderStatus =
  | "PENDING_PAYMENT"
  | "PAYMENT_FAILED"
  | "PAID"
  | "FULFILLED"
  | "CANCELLED";
export type PaymentGateway = "INDIA_GATEWAY" | "UAE_GATEWAY";
export type PaymentStatus = "INITIATED" | "REDIRECTED" | "SUCCESS" | "FAILED";
export type ModuleCode = "ASTROLOGY" | "NUMEROLOGY" | "MBTI" | "MUSIC";
export type SessionStatus = "ACTIVE" | "COMPLETED" | "ABANDONED";
export type NarrativeSource = "LLM" | "FALLBACK";
export type CountrySource = "IP_DETECTED" | "MANUAL";
