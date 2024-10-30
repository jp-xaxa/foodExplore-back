const knex = require("../database/knex")
const AppError = require("../utils/AppError")

class FavoriteProductsController {
  async create(request, response) {
    const { id } = request.params
    const user_id = request.user.id

    const checkExistProductFavorite = await knex("favorite_products")
      .where({
        product_id: id,
        user_id,
      })
      .first()

    if (!checkExistProductFavorite) {
      throw new AppError("Este produto já está na lista de favoritos.")
    }

    await knex("favorite_products").insert({
      product_id: id,
      user_id,
    })

    return response.status(201).json()
  }

  async delete(request, response) {
    const { id } = request.params
    const user_id = request.user.id

    const checkExistProductFavorite = await knex("favorite_products")
      .where({
        product_id: id,
        user_id,
      })
      .first()

    if (!checkExistProductFavorite) {
      throw new AppError("Este produto não está na sua lista de favoritos.")
    }

    await knex("users")
      .where({
        product_id: id,
        user_id,
      })
      .delete()

    return response.status(201).json()
  }

  async index(request, response) {
    const user_id = request.user.id

    const favoriteProductIds = await knex("favorite_products")
      .where({ user_id })
      .pluck("product_id")

    if (favoriteProductIds.length === 0) {
      return response.status(200).json([])
    }

    const products = await knex("products")
      .whereIn("id", favoriteProductIds) 
      .orderBy("name")

    return response.status(200).json(products)
  }
}

module.exports = FavoriteProductsController
