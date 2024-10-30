const { Router } = require("express")

const FavoriteProductsController = require("../controllers/FavoriteProductsController")

const ensureAuthenticated = require("../middlewares/ensureAuthenticated")

const favoriteRoutes = Router()

const favoriteProductsController = new FavoriteProductsController()

favoriteRoutes.use(ensureAuthenticated)

favoriteRoutes.post("/:id", favoriteProductsController.create)
favoriteRoutes.delete(":id/", favoriteProductsController.delete)
favoriteRoutes.get("/", favoriteProductsController.index)

module.exports = favoriteRoutes
