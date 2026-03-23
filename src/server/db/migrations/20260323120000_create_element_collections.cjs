/**
 * Curated product collections organized by element.
 * Used by RecommendationService Tier 3.
 *
 * @param {import("knex").Knex} knex
 */
exports.up = function (knex) {
  return knex.schema.createTable("element_collections", (t) => {
    t.increments("id").primary();
    t.string("element", 10).notNullable(); // AIR, WATER, FIRE, EARTH, SPIRIT
    t.integer("product_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("products")
      .onDelete("CASCADE");
    t.integer("sort_order").defaultTo(0);
    t.string("collection_name", 100).nullable(); // e.g., "Fire Essentials"
    t.timestamps(true, true);
    t.unique(["element", "product_id"]);
    t.index("element");
  });
};

/**
 * @param {import("knex").Knex} knex
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("element_collections");
};
