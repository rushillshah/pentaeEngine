import db from "./knex";
import { seedAll } from "./utils/seedHelpers";

async function reset() {
  try {
    console.log("Dropping all tables...");

    // Drop knex tracking tables first
    await db.raw("DROP TABLE IF EXISTS knex_migrations_lock CASCADE");
    await db.raw("DROP TABLE IF EXISTS knex_migrations CASCADE");

    // Drop personalization tables
    await db.raw("DROP TABLE IF EXISTS personalization_recommendation_items CASCADE");
    await db.raw("DROP TABLE IF EXISTS personalization_recommendations CASCADE");
    await db.raw("DROP TABLE IF EXISTS personalization_module_responses CASCADE");
    await db.raw("DROP TABLE IF EXISTS personalization_sessions CASCADE");

    // Drop commerce tables
    await db.raw("DROP TABLE IF EXISTS payment_webhook_events CASCADE");
    await db.raw("DROP TABLE IF EXISTS payment_attempts CASCADE");
    await db.raw("DROP TABLE IF EXISTS order_items CASCADE");
    await db.raw("DROP TABLE IF EXISTS orders CASCADE");
    await db.raw("DROP TABLE IF EXISTS cart_items CASCADE");
    await db.raw("DROP TABLE IF EXISTS carts CASCADE");

    // Drop product tables
    await db.raw("DROP TABLE IF EXISTS element_collections CASCADE");
    await db.raw("DROP TABLE IF EXISTS product_images CASCADE");
    await db.raw("DROP TABLE IF EXISTS products CASCADE");

    // Drop user tables
    await db.raw("DROP TABLE IF EXISTS user_country_preferences CASCADE");
    await db.raw("DROP TABLE IF EXISTS anonymous_users CASCADE");
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
