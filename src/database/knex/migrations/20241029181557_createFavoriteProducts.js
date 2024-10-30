exports.up = (knex) =>
  knex.schema.createTable("favorite_products", (table) => {
    table.increments("id")
    table
      .integer("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
    table
      .integer("product_id")
      .references("id")
      .inTable("products")
      .onDelete("CASCADE")
    table.unique(["user_id", "product_id"])
  })

exports.down = (knex) => knex.schema.dropTable("favorite_products")
