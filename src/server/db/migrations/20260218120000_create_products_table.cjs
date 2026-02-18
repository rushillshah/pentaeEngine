/**
 * @param {import("knex").Knex} knex
 */
exports.up = async function (knex) {
  await knex.schema.createTable("products", (t) => {
    t.increments("id").primary();
    t.string("product_id", 50).notNullable().unique();
    t.string("variant_id", 50).notNullable().unique();
    t.string("sku", 50).notNullable().unique();
    t.string("title", 255).notNullable();
    t.string("variant_title", 100).nullable();
    t.integer("quantity").notNullable().defaultTo(0);
    t.string("currency", 3).notNullable().defaultTo("AED");
    t.integer("unit_price").notNullable();
    t.integer("discount_amount").notNullable().defaultTo(0);
    t.integer("tax_amount").notNullable().defaultTo(0);
    t.integer("line_total").notNullable();
    t.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    t.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());

    t.index("product_id");
    t.index("variant_id");
    t.index("sku");
  });
};

/**
 * @param {import("knex").Knex} knex
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("products");
};
