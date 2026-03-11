import type { CountryCode, CurrencyCode, OrderStatus } from "./enums";

export interface Order {
  id: number;
  anonymous_user_id: string;
  status: OrderStatus;
  country: CountryCode;
  currency: CurrencyCode;
  subtotal: number; // minor units
  tax_amount: number;
  total_amount: number;
  email: string;
  phone: string;
  shipping_full_name: string;
  shipping_address_line1: string;
  shipping_address_line2: string | null;
  shipping_city: string;
  shipping_state: string | null;
  shipping_postal_code: string | null;
  shipping_country: CountryCode;
  terms_accepted: boolean;
  terms_accepted_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number; // minor units
  line_total: number;
  product_name_snapshot: string | null;
  created_at: Date;
}
