exports.up = (knex) =>
  knex.schema.createTable("product_ingredients", (table) => {
    table.increments("id")
    table.text("name").notNullable()
    table
      .integer("product_id")
      .references("id")
      .inTable("products")
      .onDelete("CASCADE")
    table.timestamp("created_at").default(knex.fn.now())
  })

exports.down = (knex) => knex.schema.dropTable("product_ingredients")
