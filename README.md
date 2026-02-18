# pentaeEngine

Full-stack jewelry ecommerce powered by elemental numerology.

## Tech Stack

- **Frontend**: Next.js (App Router) + React + Tailwind CSS
- **Backend**: Next.js API routes + PostgreSQL + Knex
- **Engine**: Python numerology/astrology engines
- **Language**: TypeScript (strict mode)

## Prerequisites

- **Node.js** 18+
- **PostgreSQL** 14+ running locally on port 5432
- **Python 3** (for numerology engine)

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Create .env.local with your DB credentials
cat > .env.local << 'EOF'
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=pentae
EOF

# 3. Set up the database
npm run db:init      # Create the 'pentae' database
npm run db:up        # Run migrations (users + products tables)
npm run db:seed      # Seed 10 users + 15 product variants

# 4. Start the app
npm run dev          # http://localhost:3000
```

After startup you should see:
- **/** — Landing page
- **/shop** — Product catalog (5 element-themed jewelry items with size variants)
- **/about** — Brand story
- **/api/products** — Products JSON API
- **/api/health** — Health check

## DB Scripts

| Script | Description |
|--------|-------------|
| `db:init` | Create database if not exists |
| `db:up` | Run pending migrations |
| `db:down` | Rollback last migration batch |
| `db:reset` | Drop all tables, re-migrate, and re-seed |
| `db:seed` | Truncate + re-seed data (no schema change) |
| `db:status` | Show completed/pending migrations |
| `db:migration` | Generate a new migration file |
| `db:test-conn` | Print DB name, user, PG version |

## Numerology Engine

```bash
cd src && python3 -m engines.numerology.supervisor
```

### Example

```text
Welcome to the Elemental Numerology Supervisor.
-----------------------------------------------
Enter Date of Birth (YYYY-MM-DD): 2000-05-17
Enter Full Name: Rushill Shah

==============================
REPORT FOR: RUSHILL SHAH
==============================

[NUMBERS]
Life Path: 6
Expression: 9
Soul Urge: 4

==============================
FINAL ELEMENTAL SIGNATURE
==============================
earth    | █████████ 45.0%
water    | ████████ 40.0%
spirit   | ███ 15.0%
air      |  0.0%
fire     |  0.0%
```
