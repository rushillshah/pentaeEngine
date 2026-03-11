import type { CurrencyCode, PaymentGateway, PaymentStatus } from "./enums";

export interface PaymentAttempt {
  id: number;
  order_id: number;
  gateway: PaymentGateway;
  currency: CurrencyCode;
  amount: number; // minor units
  status: PaymentStatus;
  provider_payment_id: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface PaymentWebhookEvent {
  id: number;
  gateway: PaymentGateway;
  provider_event_id: string;
  order_id: number | null;
  event_type: "PAYMENT_SUCCESS" | "PAYMENT_FAILED";
  raw_payload: Record<string, unknown> | null;
  processed: boolean;
  processed_at: Date | null;
  created_at: Date;
}
