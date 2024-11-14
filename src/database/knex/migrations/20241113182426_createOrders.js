exports.up = (knex) =>
  knex.schema.createTable("orders", (table) => {
    table.increments("id")
    table.integer("user_id").references("id").inTable("users").notNullable()
    table.string("status").defaultTo("Pendente")
    table.timestamp("created_at").defaultTo(knex.fn.now())
    table.string("location").notNullable()
    table
      .enum("payment_method", ["credit_card", "pix"])
      .notNullable()
      .defaultTo("credit_card")
    table.string("card_number").nullable()
    table.string("card_expiration").nullable()
    table.string("card_cvc").nullable()
  })

exports.down = (knex) => knex.schema.dropTable("orders")
