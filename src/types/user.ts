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

export type PublicUser = Omit<User, "password_hash">;

export type AuthUser = Pick<User, "id" | "email" | "first_name" | "last_name" | "role">;

export type EditableUserFields = Pick<
  User,
  | "first_name"
  | "last_name"
  | "email"
  | "phone"
  | "shipping_address_line1"
  | "shipping_address_line2"
  | "shipping_city"
  | "shipping_state"
  | "shipping_postal_code"
  | "shipping_country"
>;

export type AccountUserData = Pick<User, "id"> & EditableUserFields;

export type UserUpdateInput = Partial<EditableUserFields>;
