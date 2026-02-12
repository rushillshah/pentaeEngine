# pentaeEngine

Full-stack jewelry ecommerce powered by elemental numerology.

## Tech Stack

- **Frontend**: Next.js (App Router) + React
- **Backend**: Next.js API routes + PostgreSQL + Knex
- **Engine**: Python numerology/astrology engines

## Quick Start

```bash
npm install
npm run db:init      # Create the 'pentae' database
npm run db:up        # Run migrations
npm run db:reset     # Drop all → migrate → seed 10 users
npm run dev          # Start Next.js at localhost:3000
```

## DB Scripts

| Script | Description |
|--------|-------------|
| `db:init` | Create database if not exists |
| `db:up` | Run pending migrations |
| `db:down` | Rollback last migration batch |
| `db:reset` | Drop all tables → migrate → seed |
| `db:seed` | Truncate + re-seed (no schema change) |
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
