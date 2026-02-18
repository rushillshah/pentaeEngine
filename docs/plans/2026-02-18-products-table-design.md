# Products Table, Seed Script & Service Layer

## Decision Summary

- **Architecture**: Keep unified Next.js (FE + BE in one app, one `npm run dev`)
- **Data model**: Flat single `products` table (pricing fields as columns, not JSONB)
- **Service layer**: Route handlers delegate to service classes for business logic/queries
- **Seed data**: Hardcoded element-themed jewelry (5 products x 3 variants = 15 rows)

## Products Table Schema

```sql
CREATE TABLE products (
  id              SERIAL PRIMARY KEY,
  product_id      VARCHAR(50) UNIQUE NOT NULL,
  variant_id      VARCHAR(50) UNIQUE NOT NULL,
  sku             VARCHAR(50) UNIQUE NOT NULL,
  title           VARCHAR(255) NOT NULL,
  variant_title   VARCHAR(100),
  quantity        INTEGER DEFAULT 0,
  currency        VARCHAR(3) DEFAULT 'AED',
  unit_price      INTEGER NOT NULL,       -- minor units (19900 = 199.00 AED)
  discount_amount INTEGER DEFAULT 0,
  tax_amount      INTEGER DEFAULT 0,
  line_total      INTEGER NOT NULL,
  created_at      TIMESTAMP DEFAULT now(),
  updated_at      TIMESTAMP DEFAULT now()
);

-- Indexes on: product_id, variant_id, sku
```

## Service Layer Pattern

Routes handle HTTP concerns only. Service classes own business logic and DB queries.

```
src/app/api/products/route.ts    -> imports ProductService, calls methods
src/server/services/ProductService.ts  -> queries, transforms, business logic
```

Route example:
```ts
// route.ts - thin, only HTTP concerns
export async function GET() {
  const products = await ProductService.getAll();
  return NextResponse.json(products);
}
```

Service example:
```ts
// ProductService.ts - owns all product logic
class ProductService {
  static async getAll() { ... }
  static async getById(productId: string) { ... }
}
```

## Seed Data

5 element-themed products, each with size variants:

| Product | Sizes | Unit Price (AED) | SKU Pattern |
|---------|-------|-------------------|-------------|
| Fire Element Ring | S, M, L | 199.00 (19900) | FIRE-RING-{S,M,L} |
| Water Element Pendant | S, M, L | 249.00 (24900) | WATER-PENDANT-{S,M,L} |
| Earth Element Bracelet | S, M, L | 179.00 (17900) | EARTH-BRACELET-{S,M,L} |
| Air Element Earrings | S, M, L | 149.00 (14900) | AIR-EARRINGS-{S,M,L} |
| Aether Necklace | S, M, L | 299.00 (29900) | AETHER-NECKLACE-{S,M,L} |

All 15 rows seeded with `quantity: 2`, `discount_amount: 0`, `tax_amount: 0`, `line_total: unit_price * quantity`.

## Files

| File | Action |
|------|--------|
| `src/server/db/migrations/20260218120000_create_products_table.cjs` | Create - migration |
| `src/server/types/product.ts` | Create - TypeScript interface |
| `src/server/services/ProductService.ts` | Create - service class |
| `src/server/db/utils/seedHelpers.ts` | Modify - add `seedProducts()` |
| `src/server/db/seed.ts` | Modify - call `seedProducts()` |
| `src/app/api/products/route.ts` | Create - thin route handler |
