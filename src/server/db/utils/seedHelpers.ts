import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import type { Knex } from "knex";

interface UserSeed {
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
  shipping_country: string;
  is_verified: boolean;
  is_active: boolean;
  role: string;
}

function makeUser(overrides: Partial<UserSeed> = {}): UserSeed {
  const hash = bcrypt.hashSync("password123", 10);
  return {
    email: faker.internet.email().toLowerCase(),
    password_hash: hash,
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    phone: faker.phone.number({ style: "national" }),
    shipping_address_line1: faker.location.streetAddress(),
    shipping_address_line2: null,
    shipping_city: faker.location.city(),
    shipping_state: faker.location.state({ abbreviated: true }),
    shipping_postal_code: faker.location.zipCode(),
    shipping_country: "US",
    is_verified: true,
    is_active: true,
    role: "customer",
    ...overrides,
  };
}

export async function seedAll(db: Knex) {
  await db("users").truncate();

  const admin = makeUser({
    email: "admin@pentae.com",
    first_name: "Admin",
    last_name: "User",
    role: "admin",
  });

  const customers = Array.from({ length: 9 }, () => makeUser());

  await db("users").insert([admin, ...customers]);
  console.log("Seeded 10 users (1 admin + 9 customers).");
}
