const knex = require("../database/knex")

class ProductSearchController {
  async index(request, response) {
    const { search } = request.query

    // 1. Pesquisar produtos cujo nome contém o termo de busca
    const products = await knex("products")
      .whereLike("name", `%${search}%`)
      .orderBy("name")

    // 2. Pesquisar ingredientes cujo nome contém o termo de busca
    const matchedIngredients = await knex("product_ingredients").whereLike(
      "name",
      `%${search}%`
    )

    // 3. Recuperar os IDs dos produtos relacionados aos ingredientes encontrados
    const matchedProductIds = matchedIngredients.map(
      (ingredient) => ingredient.product_id
    )

    // 4. Recuperar produtos associados aos IDs dos ingredientes encontrados
    let matchedProducts = await knex("products")
      .whereIn("id", matchedProductIds)
      .orderBy("name")

    // 5. Se não houver produtos nem ingredientes correspondentes, retornar uma lista vazia
    if (products.length === 0 && matchedProducts.length === 0) {
      return response.json([])
    }

    // 6. Recuperar os IDs de todos os produtos encontrados para buscar seus ingredientes
    const allProductIds = [
      ...new Set([...products.map((p) => p.id), ...matchedProductIds]),
    ]

    const ingredients = await knex("product_ingredients").whereIn(
      "product_id",
      allProductIds
    )

    // 7. Agrupar os ingredientes por produto
    const productsWithIngredients = [...products, ...matchedProducts].map(
      (product) => {
        const productIngredients = ingredients.filter(
          (ingredient) => ingredient.product_id === product.id
        )
        return {
          ...product,
          ingredients: productIngredients,
        }
      }
    )

    // 8. Usar um Map para remover duplicados
    const finalProducts = Array.from(
      new Map(
        productsWithIngredients.map((product) => [product.id, product])
      ).values()
    )

    // 9. Responder com a lista final de produtos sem duplicatas
    return response.json(finalProducts)
  }
}

module.exports = ProductSearchController
