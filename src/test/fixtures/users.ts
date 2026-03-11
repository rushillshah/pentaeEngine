import type { User, PublicUser, AuthUser } from "@/types/user";

export const mockUser: User = {
  id: 1,
  email: "test@example.com",
  password_hash: "$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ012",
  first_name: "Jane",
  last_name: "Doe",
  phone: "+971501234567",
  shipping_address_line1: "123 Gold St",
  shipping_address_line2: null,
  shipping_city: "Dubai",
  shipping_state: "Dubai",
  shipping_postal_code: "00000",
  shipping_country: "AE",
  is_verified: true,
  is_active: true,
  role: "customer",
  created_at: new Date("2025-01-01"),
  updated_at: new Date("2025-01-01"),
  last_login_at: new Date("2025-06-01"),
};

export const mockPublicUser: PublicUser = {
  id: mockUser.id,
  email: mockUser.email,
  first_name: mockUser.first_name,
  last_name: mockUser.last_name,
  phone: mockUser.phone,
  shipping_address_line1: mockUser.shipping_address_line1,
  shipping_address_line2: mockUser.shipping_address_line2,
  shipping_city: mockUser.shipping_city,
  shipping_state: mockUser.shipping_state,
  shipping_postal_code: mockUser.shipping_postal_code,
  shipping_country: mockUser.shipping_country,
  is_verified: mockUser.is_verified,
  is_active: mockUser.is_active,
  role: mockUser.role,
  created_at: mockUser.created_at,
  updated_at: mockUser.updated_at,
  last_login_at: mockUser.last_login_at,
};

export const mockAuthUser: AuthUser = {
  id: mockUser.id,
  email: mockUser.email,
  first_name: mockUser.first_name,
  last_name: mockUser.last_name,
  role: mockUser.role,
};
