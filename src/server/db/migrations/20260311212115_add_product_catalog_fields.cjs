/**
 * @param {import("knex").Knex} knex
 */
exports.up = async function (knex) {
  await knex.schema.alterTable("products", (t) => {
    t.text("brand_name").nullable();
    t.text("product_name").nullable();
    t.text("product_title").nullable();
    t.text("product_element").nullable();
    t.text("description").nullable();
    t.text("main_category").nullable();
    t.text("sub_category").nullable();
    t.text("style").nullable();
    t.boolean("availability").nullable().defaultTo(true);
    t.text("shipping_policy").nullable();
    t.text("care_instructions").nullable();
    t.text("disclaimer").nullable();
    t.decimal("price", 12, 2).nullable();
    t.text("stone_details").nullable();
    t.decimal("stone_weight", 10, 3).nullable();
    t.text("diamond_details").nullable();
    t.decimal("diamond_weight", 10, 3).nullable();
    t.text("metal").nullable();
    t.decimal("metal_weight", 10, 3).nullable();
    t.text("size").nullable();
    t.text("charm_name").nullable();
    t.text("charm_type").nullable();
    t.text("charm_details").nullable();
    t.decimal("charm_weight", 10, 3).nullable();
    t.text("charm_metal").nullable();
    t.decimal("charm_metal_weight", 10, 3).nullable();
    t.text("charm_stone").nullable();
    t.decimal("charm_stone_weight", 10, 3).nullable();
    t.text("charm_diamond").nullable();
    t.decimal("charm_diamond_weight", 10, 3).nullable();
    t.text("charm_care").nullable();
  });
};

/**
 * @param {import("knex").Knex} knex
 */
exports.down = async function (knex) {
  await knex.schema.alterTable("products", (t) => {
    t.dropColumn("brand_name");
    t.dropColumn("product_name");
    t.dropColumn("product_title");
    t.dropColumn("product_element");
    t.dropColumn("description");
    t.dropColumn("main_category");
    t.dropColumn("sub_category");
    t.dropColumn("style");
    t.dropColumn("availability");
    t.dropColumn("shipping_policy");
    t.dropColumn("care_instructions");
    t.dropColumn("disclaimer");
    t.dropColumn("price");
    t.dropColumn("stone_details");
    t.dropColumn("stone_weight");
    t.dropColumn("diamond_details");
    t.dropColumn("diamond_weight");
    t.dropColumn("metal");
    t.dropColumn("metal_weight");
    t.dropColumn("size");
    t.dropColumn("charm_name");
    t.dropColumn("charm_type");
    t.dropColumn("charm_details");
    t.dropColumn("charm_weight");
    t.dropColumn("charm_metal");
    t.dropColumn("charm_metal_weight");
    t.dropColumn("charm_stone");
    t.dropColumn("charm_stone_weight");
    t.dropColumn("charm_diamond");
    t.dropColumn("charm_diamond_weight");
    t.dropColumn("charm_care");
  });
};
