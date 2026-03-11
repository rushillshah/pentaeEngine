/**
 * Guest cart, orders (with checkout/shipping inline), payments + webhooks.
 * Checkout profile fields are merged into orders (no separate table).
 * @param {import("knex").Knex} knex
 */
exports.up = async function (knex) {
  // ── Carts ──────────────────────────────────────────────
  await knex.schema.createTable("carts", (t) => {
    t.increments("id").primary();
    t.uuid("anonymous_user_id")
      .notNullable()
      .references("id")
      .inTable("anonymous_users")
      .onDelete("CASCADE");
    t.string("country", 2).notNullable(); // IN / AE
    t.string("currency", 3).notNullable(); // INR / AED
    t.string("status", 20).notNullable().defaultTo("ACTIVE"); // ACTIVE / ABANDONED
    t.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    t.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());

    t.index("anonymous_user_id");
    t.index("status");
  });

  await knex.schema.createTable("cart_items", (t) => {
    t.increments("id").primary();
    t.integer("cart_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("carts")
      .onDelete("CASCADE");
    t.integer("product_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("products");
    t.integer("quantity").notNullable().defaultTo(1);
    t.integer("unit_price").nullable(); // minor units — snapshot at time of pricing
    t.integer("line_total").nullable(); // minor units
    t.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    t.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());

    t.unique(["cart_id", "product_id"]);
    t.index("cart_id");
    t.index("product_id");
  });

  // ── Orders ─────────────────────────────────────────────
  await knex.schema.createTable("orders", (t) => {
    t.increments("id").primary();
    t.uuid("anonymous_user_id")
      .notNullable()
      .references("id")
      .inTable("anonymous_users")
      .onDelete("CASCADE");
    t.string("status", 20).notNullable().defaultTo("PENDING_PAYMENT");
    // PENDING_PAYMENT / PAYMENT_FAILED / PAID / FULFILLED / CANCELLED
    t.string("country", 2).notNullable();
    t.string("currency", 3).notNullable();
    t.integer("subtotal").notNullable().defaultTo(0); // minor units
    t.integer("tax_amount").notNullable().defaultTo(0);
    t.integer("total_amount").notNullable().defaultTo(0);

    // Contact
    t.string("email", 255).notNullable();
    t.string("phone", 20).notNullable();

    // Shipping (checkout profile merged here)
    t.string("shipping_full_name", 255).notNullable();
    t.string("shipping_address_line1", 255).notNullable();
    t.string("shipping_address_line2", 255).nullable();
    t.string("shipping_city", 100).notNullable();
    t.string("shipping_state", 100).nullable();
    t.string("shipping_postal_code", 20).nullable();
    t.string("shipping_country", 2).notNullable();

    // Consent
    t.boolean("terms_accepted").notNullable().defaultTo(false);
    t.timestamp("terms_accepted_at").nullable();

    t.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    t.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());

    t.index("anonymous_user_id");
    t.index("status");
    t.index("created_at");
  });

  await knex.schema.createTable("order_items", (t) => {
    t.increments("id").primary();
    t.integer("order_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("orders")
      .onDelete("CASCADE");
    t.integer("product_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("products");
    t.integer("quantity").notNullable();
    t.integer("unit_price").notNullable(); // minor units
    t.integer("line_total").notNullable(); // minor units
    t.string("product_name_snapshot", 255).nullable();
    t.timestamp("created_at").notNullable().defaultTo(knex.fn.now());

    t.index("order_id");
  });

  // ── Payments ───────────────────────────────────────────
  await knex.schema.createTable("payment_attempts", (t) => {
    t.increments("id").primary();
    t.integer("order_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("orders")
      .onDelete("CASCADE");
    t.string("gateway", 20).notNullable(); // INDIA_GATEWAY / UAE_GATEWAY
    t.string("currency", 3).notNullable();
    t.integer("amount").notNullable(); // minor units
    t.string("status", 20).notNullable().defaultTo("INITIATED");
    // INITIATED / REDIRECTED / SUCCESS / FAILED
    t.string("provider_payment_id", 255).nullable();
    t.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    t.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());

    t.index("order_id");
    t.index("gateway");
  });

  await knex.schema.createTable("payment_webhook_events", (t) => {
    t.increments("id").primary();
    t.string("gateway", 20).notNullable();
    t.string("provider_event_id", 255).notNullable(); // idempotency key
    t.integer("order_id")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("orders")
      .onDelete("SET NULL");
    t.string("event_type", 30).notNullable(); // PAYMENT_SUCCESS / PAYMENT_FAILED
    t.jsonb("raw_payload").nullable();
    t.boolean("processed").notNullable().defaultTo(false);
    t.timestamp("processed_at").nullable();
    t.timestamp("created_at").notNullable().defaultTo(knex.fn.now());

    t.unique(["gateway", "provider_event_id"]);
    t.index("order_id");
    t.index("processed");
  });
};

/**
 * @param {import("knex").Knex} knex
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("payment_webhook_events");
  await knex.schema.dropTableIfExists("payment_attempts");
  await knex.schema.dropTableIfExists("order_items");
  await knex.schema.dropTableIfExists("orders");
  await knex.schema.dropTableIfExists("cart_items");
  await knex.schema.dropTableIfExists("carts");
};
