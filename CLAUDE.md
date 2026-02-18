# Pentae Engine

Jewelry ecommerce platform powered by elemental numerology.

## Tech Stack

- **Framework**: Next.js (App Router) — single app serves both FE and BE
- **Database**: PostgreSQL via Knex (query builder + migrations)
- **Styling**: Tailwind CSS with custom theme (cream/gold/charcoal palette)
- **Fonts**: Playfair Display (serif headings), Inter (sans body)
- **Language**: TypeScript (strict mode)
- **Python engines**: Numerology/astrology engines in `src/engines/` (excluded from TS)

## Project Structure

```
src/
├── app/                    # Next.js App Router (FE + API routes)
│   ├── api/                # API endpoints (thin route handlers)
│   │   ├── health/         # GET /api/health
│   │   └── products/       # GET /api/products
│   ├── components/         # React components
│   ├── shop/               # /shop page
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page
│   ├── fonts.ts            # Font config
│   └── globals.css         # Global styles
├── server/                 # Backend logic (NOT served directly)
│   ├── db/
│   │   ├── knex.ts         # Knex instance
│   │   ├── knex.config.ts  # Knex config (reads .env.local)
│   │   ├── migrations/     # Knex migration files (.cjs)
│   │   ├── utils/          # Seed helpers, test connection
│   │   ├── init.ts         # DB creation script
│   │   ├── seed.ts         # Seed runner
│   │   ├── reset.ts        # Drop/migrate/seed
│   │   └── status.ts       # Migration status
│   ├── services/           # Service classes (business logic + DB queries)
│   │   └── ProductService.ts
│   ├── lib/                # Utilities (auth, etc.)
│   └── types/              # TypeScript interfaces (User, Product)
└── engines/                # Python engines (numerology, astrology)
```

## Architecture Conventions

### Service Layer Pattern
- **Route handlers** (`src/app/api/`) are thin — only HTTP concerns (parse request, return response)
- **Service classes** (`src/server/services/`) own all business logic and DB queries
- Routes import and call service class static methods
- Example: `GET /api/products` → `ProductService.getAll()`

### Migrations
- Knex migrations live in `src/server/db/migrations/`
- File format: `YYYYMMDDHHMMSS_description.cjs` (CommonJS required by Knex CLI)
- When adding a new table, also add its DROP to `src/server/db/reset.ts`

### Types
- TypeScript interfaces for DB models go in `src/server/types/`
- One file per entity (e.g., `user.ts`, `product.ts`)

### Seeding
- Seed logic lives in `src/server/db/utils/seedHelpers.ts`
- `seedAll()` is the entry point — calls individual seed functions
- Use hardcoded data for domain-specific seeds, Faker for user data

## Database

- **Host**: localhost:5432
- **Name**: pentae
- **User/Pass**: postgres/postgres (local dev)
- **Config**: `.env.local` (not committed)

## Commands

```bash
npm run dev          # Start Next.js dev server (FE + BE)
npm run build        # Production build
npm run lint         # ESLint

# Database
npm run db:init      # Create the pentae database
npm run db:up        # Run pending migrations
npm run db:down      # Rollback last migration batch
npm run db:reset     # Drop all tables, migrate, seed
npm run db:seed      # Seed data only
npm run db:status    # Show migration status
npm run db:test-conn # Test DB connection
npm run db:migration # Create new migration file
```

## Pricing Convention

All monetary values stored as **integers in minor currency units** (e.g., 19900 = 199.00 AED). Format for display with `amount / 100`.

## Environment Variables

Required in `.env.local`:
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=pentae
```
