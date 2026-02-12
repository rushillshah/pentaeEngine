import db from "./knex";
import { seedAll } from "./utils/seedHelpers";

async function seed() {
  try {
    console.log("Seeding database...");
    await seedAll(db);
    console.log("Seed complete.");
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

seed();
