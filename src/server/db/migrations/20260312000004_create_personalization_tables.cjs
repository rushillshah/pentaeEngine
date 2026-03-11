/**
 * Personalization engine: sessions, module responses, recommendations.
 *
 * Simplification: quintessence scores + narrative are embedded directly
 * on personalization_sessions instead of separate tables.
 *
 * @param {import("knex").Knex} knex
 */
exports.up = async function (knex) {
  await knex.schema.createTable("personalization_sessions", (t) => {
    t.increments("id").primary();
    t.uuid("anonymous_user_id")
      .notNullable()
      .references("id")
      .inTable("anonymous_users")
      .onDelete("CASCADE");
    t.string("status", 20).notNullable().defaultTo("ACTIVE");
    // ACTIVE / COMPLETED / ABANDONED
    t.string("country", 2).nullable();
    t.boolean("consent_given").notNullable().defaultTo(false);
    t.timestamp("consent_at").nullable();

    // ── Quintessence (embedded) ──────────────────────────
    t.decimal("air_score", 4, 2).nullable();
    t.decimal("water_score", 4, 2).nullable();
    t.decimal("fire_score", 4, 2).nullable();
    t.decimal("earth_score", 4, 2).nullable();
    t.decimal("spirit_score", 4, 2).nullable();
    t.string("dominant_element", 10).nullable(); // AIR / WATER / FIRE / EARTH / SPIRIT
    t.jsonb("weights_used").nullable();

    // ── Narrative (embedded) ─────────────────────────────
    t.string("narrative_source", 10).nullable(); // LLM / FALLBACK
    t.text("narrative_text").nullable();

    t.timestamp("started_at").notNullable().defaultTo(knex.fn.now());
    t.timestamp("completed_at").nullable();
    t.timestamp("abandoned_at").nullable();

    t.index("anonymous_user_id");
    t.index("status");
  });

  await knex.schema.createTable("personalization_module_responses", (t) => {
    t.increments("id").primary();
    t.integer("session_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("personalization_sessions")
      .onDelete("CASCADE");
    t.string("module", 20).notNullable(); // ASTROLOGY / NUMEROLOGY / MBTI / MUSIC
    t.jsonb("input_payload").nullable();
    t.jsonb("output_vector").nullable(); // { air, water, fire, earth, spirit } normalized 0–1
    t.string("status", 20).notNullable().defaultTo("COMPLETED"); // COMPLETED / FAILED
    t.timestamp("completed_at").nullable();
    t.timestamp("created_at").notNullable().defaultTo(knex.fn.now());

    t.unique(["session_id", "module"]);
    t.index("session_id");
  });

  await knex.schema.createTable("personalization_recommendations", (t) => {
    t.increments("id").primary();
    t.integer("session_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("personalization_sessions")
      .onDelete("CASCADE");
    t.string("country", 2).nullable();
    t.timestamp("created_at").notNullable().defaultTo(knex.fn.now());

    t.index("session_id");
  });

  await knex.schema.createTable("personalization_recommendation_items", (t) => {
    t.increments("id").primary();
    t.integer("recommendation_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("personalization_recommendations")
      .onDelete("CASCADE");
    t.integer("product_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("products");
    t.integer("rank").notNullable();
    t.string("reason_code", 50).nullable();

    t.unique(["recommendation_id", "rank"]);
    t.index("recommendation_id");
  });
};

/**
 * @param {import("knex").Knex} knex
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("personalization_recommendation_items");
  await knex.schema.dropTableIfExists("personalization_recommendations");
  await knex.schema.dropTableIfExists("personalization_module_responses");
  await knex.schema.dropTableIfExists("personalization_sessions");
};
