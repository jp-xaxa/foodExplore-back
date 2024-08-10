const knex = require("../database/knex")
const AppError = require("../utils/AppError.js")

class ProductController {
  async create(request, response) {
    const { name, description, value, category, ingredients } = request.body

    const [product_id] = await knex("products").insert({
      name,
      description,
      value,
      category,
    })

    const ingredientsInsert = ingredients.map((ingredient) => {
      return {
        product_id,
        name: ingredient,
      }
    })

    await knex("product_ingredients").insert(ingredientsInsert)

    return response.status(200).json({ product_id })
  }

  async update(request, response) {
    const { id } = request.params
    const { name, description, value, category, media, ingredients } =
      request.body

    const product = await knex("products").where("id", id).first()

    if (!product) {
      throw new AppError("Produto não encontrado.")
    }

    const formattedName = name.trim()
    const formattedDescription = description.trim()

    await knex("products").where({ id }).update({
      name: formattedName,
      description: formattedDescription,
      value,
      category,
      updated_at: knex.fn.now(),
    })

    if (ingredients) {
      const ingredientsOfThisNote = ingredients.map((ingredient) => {
        const formattedIngredient = ingredient.trim()

        return {
          product_id: id,
          name: formattedIngredient,
        }
      })

      await knex("product_ingredients").where({ product_id: id }).delete()

      await knex("product_ingredients").insert(ingredientsOfThisNote)
    }

    return response.status(201).json({
      status: 201,
      message: "O produto foi atualizada com sucesso.",
    })
  }

  async delete(request, response) {
    const { id } = request.params

    const product = await knex("products").where("id", id).first()

    if (!product) {
      throw new AppError("Produto não encontrado.")
    }

    await knex("products").where({ id }).delete()

    return response.status(200).json()
  }

  async index(request, response) {
    const products = await knex("products").orderBy("name")

    const meals = products.filter((product) => product.category === "Refeição")
    const desserts = products.filter(
      (product) => product.category === "Sobremesa"
    )
    const drinks = products.filter((product) => product.category === "Bebida")

    return response.status(200).json({
      meals,
      desserts,
      drinks,
    })
  }

  async show(request, response) {
    const { id } = request.params

    const product = await knex("products").where({ id }).first()
    const ingredients = await knex("product_ingredients")
      .where({ product_id: id })
      .orderBy("name")

    return response.json({ ...product, ingredients })
  }
}

module.exports = ProductController
