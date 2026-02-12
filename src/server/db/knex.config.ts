import dotenv from "dotenv";
import type { Knex } from "knex";

dotenv.config({ path: ".env.local" });

const knexConfig: Knex.Config = {
  client: "pg",
  connection: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "pentae",
  },
  pool: { min: 2, max: 10 },
  migrations: {
    directory: "./src/server/db/migrations",
    tableName: "knex_migrations",
  },
};

export default knexConfig;
