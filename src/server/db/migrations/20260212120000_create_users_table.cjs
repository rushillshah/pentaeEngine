/**
 * @param {import("knex").Knex} knex
 */
exports.up = async function (knex) {
  await knex.schema.createTable("users", (t) => {
    t.increments("id").primary();
    t.string("email", 255).notNullable().unique();
    t.string("password_hash", 255).notNullable();
    t.string("first_name", 100).notNullable();
    t.string("last_name", 100).notNullable();
    t.string("phone", 20).nullable();
    t.string("shipping_address_line1", 255).nullable();
    t.string("shipping_address_line2", 255).nullable();
    t.string("shipping_city", 100).nullable();
    t.string("shipping_state", 100).nullable();
    t.string("shipping_postal_code", 20).nullable();
    t.string("shipping_country", 2).nullable().defaultTo("US");
    t.boolean("is_verified").notNullable().defaultTo(false);
    t.boolean("is_active").notNullable().defaultTo(true);
    t.string("role", 20).notNullable().defaultTo("customer");
    t.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    t.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
    t.timestamp("last_login_at").nullable();

    t.index("email");
    t.index("role");
    t.index("is_active");
  });
};

/**
 * @param {import("knex").Knex} knex
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("users");
};
