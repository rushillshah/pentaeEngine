export interface User {
  id: number;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  shipping_address_line1: string | null;
  shipping_address_line2: string | null;
  shipping_city: string | null;
  shipping_state: string | null;
  shipping_postal_code: string | null;
  shipping_country: string | null;
  is_verified: boolean;
  is_active: boolean;
  role: string;
  created_at: Date;
  updated_at: Date;
  last_login_at: Date | null;
}
