const knex = require("../database/knex")
const AppError = require("../utils/AppError")
const dayjs = require("dayjs")

class OrdersController {
  async create(request, response) {
    const {
      products,
      card_number,
      card_expiration,
      card_cvc,
      location,
      payment_method,
    } = request.body
    const user_id = request.user.id

    if (!location || !payment_method) {
      throw new AppError(
        "Localização ou metodo de pagamento não informado!",
        400
      )
    }

    if (payment_method === "credit_card") {
      if (!card_number || !card_expiration || !card_cvc) {
        throw new AppError("Informações do cartão não foram inseridas!", 400)
      }
    }

    const [order_id] = await knex("orders")
      .insert({
        user_id,
        location,
        payment_method,
        card_number: payment_method === "credit_card" ? card_number : null,
        card_expiration:
          payment_method === "credit_card" ? card_expiration : null,
        card_cvc: payment_method === "credit_card" ? card_cvc : null,
      })
      .returning("id")

    for (let product of products) {
      await trx("orders_products").insert({
        order_id: order_id,
        product_id: product.product_id,
        quantity: product.quantity,
      })
    }

    return response.status(201).json({ order_id })
  }

  async index(request, response) {
    const user_id = request.user.id

    // Ordena os pedidos pelo campo 'created_at' do mais recente para o mais antigo
    const orders = await knex("orders")
      .select(
        "orders.id",
        "orders.location",
        "orders.payment_method",
        "orders.status",
        "orders.created_at"
      )
      .where("orders.user_id", user_id)
      .orderBy("orders.created_at", "desc") // Ordenação decrescente

    // Se o usuário não tiver pedidos, retorna uma mensagem simples
    if (!orders.length) {
      return response
        .status(200)
        .json({ message: "Você ainda não fez nenhum pedido." })
    }

    for (let order of orders) {
      const products = await knex("orders_products")
        .join("products", "orders_products.product_id", "products.id")
        .select(
          "products.id as product_id",
          "products.name",
          "products.price",
          "orders_products.quantity"
        )
        .where("orders_products.order_id", order.id)

      const formattedOrder = {
        id: order.id,
        status: order.status,
        products: products.map((product) => ({
          product_id: product.product_id,
          name: product.name,
          price: product.price,
          quantity: product.quantity,
        })),
        data: dayjs(order.created_at).format("DD/MM/YYYY"),
        hora: dayjs(order.created_at).format("HH:mm"),
      }

      order.formatted = formattedOrder
      delete order.created_at
    }

    return response
      .status(200)
      .json({ orders: orders.map((order) => order.formatted) })
  }
}

module.exports = OrdersController
