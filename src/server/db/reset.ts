import db from "./knex";
import { seedAll } from "./utils/seedHelpers";

async function reset() {
  try {
    console.log("Dropping all tables...");

    // Drop knex tracking tables first
    await db.raw("DROP TABLE IF EXISTS knex_migrations_lock CASCADE");
    await db.raw("DROP TABLE IF EXISTS knex_migrations CASCADE");

    // Drop application tables
    await db.raw("DROP TABLE IF EXISTS users CASCADE");

    // Drop custom enum types
    await db.raw("DROP TYPE IF EXISTS user_role CASCADE");

    console.log("Running migrations...");
    await db.migrate.latest();

    console.log("Seeding...");
    await seedAll(db);

    console.log("Reset complete.");
  } catch (err) {
    console.error("Reset failed:", err);
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

reset();
