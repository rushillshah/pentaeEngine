/**
 * Guest-first identity + country preference.
 * @param {import("knex").Knex} knex
 */
exports.up = async function (knex) {
  await knex.schema.createTable("anonymous_users", (t) => {
    t.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    t.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("user_country_preferences", (t) => {
    t.increments("id").primary();
    t.uuid("anonymous_user_id")
      .notNullable()
      .references("id")
      .inTable("anonymous_users")
      .onDelete("CASCADE");
    t.string("detected_country", 2).nullable(); // IN / AE
    t.string("selected_country", 2).notNullable(); // IN / AE
    t.string("source", 20).notNullable(); // IP_DETECTED / MANUAL
    t.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    t.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());

    t.index("anonymous_user_id");
  });
};

/**
 * @param {import("knex").Knex} knex
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("user_country_preferences");
  await knex.schema.dropTableIfExists("anonymous_users");
};
