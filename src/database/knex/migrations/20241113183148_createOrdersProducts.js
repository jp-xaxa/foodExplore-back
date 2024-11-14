exports.up = (knex) =>
  knex.schema.createTable("orders_products", (table) => {
    table.increments("id")
    table
      .integer("order_id")
      .references("id")
      .inTable("orders")
      .onDelete("CASCADE")
      .notNullable()
    table
      .integer("product_id")
      .references("id")
      .inTable("products")
      .onDelete("CASCADE")
      .notNullable()
    table.integer("quantity").notNullable().defaultTo(1)
  })

exports.down = (knex) => knex.schema.dropTable("orders_products")
