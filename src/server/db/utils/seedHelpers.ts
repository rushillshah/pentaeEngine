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

interface ProductSeed {
  product_id: string;
  variant_id: string;
  sku: string;
  title: string;
  variant_title: string;
  quantity: number;
  currency: string;
  unit_price: number;
  discount_amount: number;
  tax_amount: number;
  line_total: number;
  primary_element: string;
  product_type: string;
  is_active: boolean;
  in_stock: boolean;
}

const PRODUCTS = [
  { title: "Fire Element Ring", skuPrefix: "FIRE-RING", productId: "prod_fire", unitPrice: 19900, primaryElement: "FIRE" },
  { title: "Water Element Pendant", skuPrefix: "WATER-PENDANT", productId: "prod_water", unitPrice: 24900, primaryElement: "WATER" },
  { title: "Earth Element Bracelet", skuPrefix: "EARTH-BRACELET", productId: "prod_earth", unitPrice: 17900, primaryElement: "EARTH" },
  { title: "Air Element Earrings", skuPrefix: "AIR-EARRINGS", productId: "prod_air", unitPrice: 14900, primaryElement: "AIR" },
  { title: "Aether Necklace", skuPrefix: "AETHER-NECKLACE", productId: "prod_aether", unitPrice: 29900, primaryElement: "SPIRIT" },
];

const SIZES = ["S", "M", "L"];

function buildProductSeeds(): ProductSeed[] {
  const seeds: ProductSeed[] = [];
  for (const product of PRODUCTS) {
    for (const size of SIZES) {
      const quantity = 2;
      seeds.push({
        product_id: product.productId,
        variant_id: `var_${product.productId.replace("prod_", "")}_${size.toLowerCase()}`,
        sku: `${product.skuPrefix}-${size}`,
        title: product.title,
        variant_title: `Size ${size}`,
        quantity,
        currency: "AED",
        unit_price: product.unitPrice,
        discount_amount: 0,
        tax_amount: 0,
        line_total: product.unitPrice * quantity,
        primary_element: product.primaryElement,
        product_type: "HERO",
        is_active: true,
        in_stock: true,
      });
    }
  }
  return seeds;
}

async function seedUsers(db: Knex) {
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

async function seedProducts(db: Knex) {
  await db("products").truncate();
  const products = buildProductSeeds();
  await db("products").insert(products);
  console.log(`Seeded ${products.length} product variants.`);
}

export async function seedAll(db: Knex) {
  await seedUsers(db);
  await seedProducts(db);
}
