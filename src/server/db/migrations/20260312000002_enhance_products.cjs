/**
 * Add element/type classification + dual-country pricing + images table.
 * Simpler than a separate product_prices table: just two price columns.
 * @param {import("knex").Knex} knex
 */
exports.up = async function (knex) {
  await knex.schema.alterTable("products", (t) => {
    t.string("primary_element", 10).nullable(); // AIR / WATER / FIRE / EARTH / SPIRIT
    t.string("product_type", 10).nullable(); // HERO / ACCENT / CHARM
    t.boolean("is_active").notNullable().defaultTo(true);
    t.boolean("in_stock").notNullable().defaultTo(true);
    t.integer("price_inr").nullable(); // minor currency units (paise)
    t.integer("price_aed").nullable(); // minor currency units (fils)
  });

  await knex.schema.createTable("product_images", (t) => {
    t.increments("id").primary();
    t.integer("product_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("products")
      .onDelete("CASCADE");
    t.text("url").notNullable();
    t.integer("sort_order").notNullable().defaultTo(0);
    t.timestamp("created_at").notNullable().defaultTo(knex.fn.now());

    t.index("product_id");
  });
};

/**
 * @param {import("knex").Knex} knex
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("product_images");
  await knex.schema.alterTable("products", (t) => {
    t.dropColumn("primary_element");
    t.dropColumn("product_type");
    t.dropColumn("is_active");
    t.dropColumn("in_stock");
    t.dropColumn("price_inr");
    t.dropColumn("price_aed");
  });
};
