import db from "../knex";

async function testConnection() {
  try {
    const result = await db.raw(`
      SELECT current_database() AS db_name,
             current_user       AS db_user,
             version()          AS pg_version
    `);
    const { db_name, db_user, pg_version } = result.rows[0];
    console.log(`Database : ${db_name}`);
    console.log(`User     : ${db_user}`);
    console.log(`Version  : ${pg_version}`);
  } catch (err) {
    console.error("Connection failed:", err);
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

testConnection();
