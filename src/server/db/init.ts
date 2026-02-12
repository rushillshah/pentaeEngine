import Knex from "knex";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const dbName = process.env.DB_NAME || "pentae";

async function init() {
  const knex = Knex({
    client: "pg",
    connection: {
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "postgres",
      database: "postgres",
    },
  });

  try {
    const result = await knex.raw(
      "SELECT 1 FROM pg_database WHERE datname = ?",
      [dbName]
    );

    if (result.rows.length === 0) {
      await knex.raw(`CREATE DATABASE "${dbName}"`);
      console.log(`Database "${dbName}" created.`);
    } else {
      console.log(`Database "${dbName}" already exists.`);
    }
  } catch (err) {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  } finally {
    await knex.destroy();
  }
}

init();
