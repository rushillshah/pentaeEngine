# Products Table, Seed & Service Layer — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a products table with migration, seed it with element-themed jewelry, and expose via a service-class-backed API route.

**Architecture:** Flat `products` table in PostgreSQL via Knex migration. `ProductService` class owns all DB queries and business logic. Next.js API route is a thin HTTP handler that delegates to the service. Seed script adds 15 product variant rows.

**Tech Stack:** Next.js App Router, Knex (migrations + query builder), PostgreSQL, TypeScript

**Design doc:** `docs/plans/2026-02-18-products-table-design.md`

---

### Task 1: Create Products Migration

**Files:**
- Create: `src/server/db/migrations/20260218120000_create_products_table.cjs`

**Step 1: Write the migration file**

Follow the exact same CJS pattern as the existing users migration at `src/server/db/migrations/20260212120000_create_users_table.cjs`.

```js
/**
 * @param {import("knex").Knex} knex
 */
exports.up = async function (knex) {
  await knex.schema.createTable("products", (t) => {
    t.increments("id").primary();
    t.string("product_id", 50).notNullable().unique();
    t.string("variant_id", 50).notNullable().unique();
    t.string("sku", 50).notNullable().unique();
    t.string("title", 255).notNullable();
    t.string("variant_title", 100).nullable();
    t.integer("quantity").notNullable().defaultTo(0);
    t.string("currency", 3).notNullable().defaultTo("AED");
    t.integer("unit_price").notNullable();
    t.integer("discount_amount").notNullable().defaultTo(0);
    t.integer("tax_amount").notNullable().defaultTo(0);
    t.integer("line_total").notNullable();
    t.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    t.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());

    t.index("product_id");
    t.index("variant_id");
    t.index("sku");
  });
};

/**
 * @param {import("knex").Knex} knex
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("products");
};
```

**Step 2: Run the migration**

Run: `npm run db:up`
Expected: Output shows migration applied, table created.

**Step 3: Verify the table exists**

Run: `npm run db:status`
Expected: Both users and products migrations show as completed.

**Step 4: Commit**

```bash
git add src/server/db/migrations/20260218120000_create_products_table.cjs
git commit -m "feat: add products table migration"
```

---

### Task 2: Create Product Type

**Files:**
- Create: `src/server/types/product.ts`

Follow the same pattern as `src/server/types/user.ts`.

**Step 1: Write the Product interface**

```ts
export interface Product {
  id: number;
  product_id: string;
  variant_id: string;
  sku: string;
  title: string;
  variant_title: string | null;
  quantity: number;
  currency: string;
  unit_price: number;
  discount_amount: number;
  tax_amount: number;
  line_total: number;
  created_at: Date;
  updated_at: Date;
}
```

**Step 2: Commit**

```bash
git add src/server/types/product.ts
git commit -m "feat: add Product type interface"
```

---

### Task 3: Create ProductService Class

**Files:**
- Create: `src/server/services/ProductService.ts`

This is the service class that owns all product DB queries and business logic. Routes will import and call its static methods.

**Step 1: Write ProductService**

```ts
import db from "@/server/db/knex";
import type { Product } from "@/server/types/product";

export class ProductService {
  static async getAll(): Promise<Product[]> {
    return db<Product>("products").select("*").orderBy("title");
  }

  static async getByProductId(productId: string): Promise<Product[]> {
    return db<Product>("products").where({ product_id: productId });
  }

  static async getByVariantId(variantId: string): Promise<Product | undefined> {
    return db<Product>("products").where({ variant_id: variantId }).first();
  }

  static async getBySku(sku: string): Promise<Product | undefined> {
    return db<Product>("products").where({ sku }).first();
  }
}
```

**Step 2: Commit**

```bash
git add src/server/services/ProductService.ts
git commit -m "feat: add ProductService with query methods"
```

---

### Task 4: Add Product Seed Data

**Files:**
- Modify: `src/server/db/utils/seedHelpers.ts` — add `seedProducts()` function
- Modify: `src/server/db/seed.ts` — call `seedProducts()` after `seedUsers()`

**Step 1: Add seedProducts to seedHelpers.ts**

Add the following after the existing `seedAll` function. Also rename `seedAll` to `seedUsers` and add a new `seedAll` that calls both:

```ts
// -- add this interface above seedAll --
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
}

const PRODUCTS: { title: string; skuPrefix: string; productId: string; unitPrice: number }[] = [
  { title: "Fire Element Ring", skuPrefix: "FIRE-RING", productId: "prod_fire", unitPrice: 19900 },
  { title: "Water Element Pendant", skuPrefix: "WATER-PENDANT", productId: "prod_water", unitPrice: 24900 },
  { title: "Earth Element Bracelet", skuPrefix: "EARTH-BRACELET", productId: "prod_earth", unitPrice: 17900 },
  { title: "Air Element Earrings", skuPrefix: "AIR-EARRINGS", productId: "prod_air", unitPrice: 14900 },
  { title: "Aether Necklace", skuPrefix: "AETHER-NECKLACE", productId: "prod_aether", unitPrice: 29900 },
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
      });
    }
  }
  return seeds;
}

async function seedProducts(db: Knex) {
  await db("products").truncate();
  const products = buildProductSeeds();
  await db("products").insert(products);
  console.log(`Seeded ${products.length} product variants.`);
}
```

Then update `seedAll` to call both:

```ts
export async function seedAll(db: Knex) {
  // -- existing user seeding code stays here --
  await seedUsers(db);
  await seedProducts(db);
}
```

Refactor: extract the existing user-seeding code into a `seedUsers(db)` function (private, not exported) and have `seedAll` call both `seedUsers` and `seedProducts`.

**Step 2: Verify seed.ts still works**

`seed.ts` already calls `seedAll(db)`, so no changes needed to `seed.ts` if `seedAll` calls both internally. If the existing code in `seedHelpers.ts` does user seeding directly in `seedAll`, refactor it into a private `seedUsers` function.

**Step 3: Run the seed**

Run: `npm run db:seed`
Expected: Output shows "Seeded 10 users (1 admin + 9 customers)." and "Seeded 15 product variants."

**Step 4: Commit**

```bash
git add src/server/db/utils/seedHelpers.ts
git commit -m "feat: add product seed data (15 element-themed variants)"
```

---

### Task 5: Create Products API Route

**Files:**
- Create: `src/app/api/products/route.ts`

Thin route handler — only HTTP concerns. Delegates to `ProductService`.

**Step 1: Write the route**

```ts
import { NextResponse } from "next/server";
import { ProductService } from "@/server/services/ProductService";

export async function GET() {
  try {
    const products = await ProductService.getAll();
    return NextResponse.json(products);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
```

**Step 2: Verify the endpoint**

Run: `curl http://localhost:3000/api/products`
Expected: JSON array of 15 product objects.

**Step 3: Commit**

```bash
git add src/app/api/products/route.ts
git commit -m "feat: add GET /api/products route backed by ProductService"
```

---

### Task 6: End-to-End Verification

**Step 1: Reset and verify full flow**

Run: `npm run db:reset`
Expected: Tables dropped, migrations re-applied, both users and products seeded.

**Step 2: Start dev server and hit the endpoint**

Run: `npm run dev` (in background)
Then: `curl http://localhost:3000/api/products | head -c 500`
Expected: JSON array with product objects containing product_id, variant_id, sku, title, variant_title, quantity, currency, unit_price, discount_amount, tax_amount, line_total.

**Step 3: Final commit (if any remaining changes)**

```bash
git add -A
git commit -m "feat: products table, service layer, seed data, and API route"
```
