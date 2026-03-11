import type { CartStatus, CountryCode, CurrencyCode } from "./enums";

export interface Cart {
  id: number;
  anonymous_user_id: string;
  country: CountryCode;
  currency: CurrencyCode;
  status: CartStatus;
  created_at: Date;
  updated_at: Date;
}

export interface CartItem {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  unit_price: number | null; // minor units — snapshot at pricing time
  line_total: number | null;
  created_at: Date;
  updated_at: Date;
}
