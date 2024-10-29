const knex = require("../database/knex")
const AppError = require("../utils/AppError")
const DiskStorage = require("../providers/DiskStorage")

class ProductMediaController {
  async update(request, response) {
    const { id } = request.params
    const mediaFilename = request.file.filename

    const diskStorage = new DiskStorage()

    const product = await knex("products").where({ id }).first()

    if (product.media) {
      await diskStorage.deleteFile(product.media)
    }

    const filename = await diskStorage.saveFile(mediaFilename)
    product.media = filename

    await knex("products").update(product).where({ id })

    return response.status(201).json()
  }
}

module.exports = ProductMediaController
