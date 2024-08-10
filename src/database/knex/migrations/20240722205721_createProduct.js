exports.up = (knex) =>
  knex.schema.createTable("products", (table) => {
    table.increments("id")
    table.text("name").notNullable()
    table.text("description").notNullable()
    table.decimal("value", 10, 2).notNullable()
    table.text("category").notNullable()
    table.text("media")

    table.timestamp("created_at").default(knex.fn.now())
    table.timestamp("updated_at").default(knex.fn.now())
  })

exports.down = (knex) => knex.schema.dropTable("products")
