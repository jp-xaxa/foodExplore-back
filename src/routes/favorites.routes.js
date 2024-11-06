const { Router } = require("express")

const FavoritesProductsController = require("../controllers/FavoritesProductsController")

const ensureAuthenticated = require("../middlewares/ensureAuthenticated")
const verifyUserAuthorization = require("../middlewares/verifyUserAuthorization")

const favoritesRoutes = Router()

const favoritesProductsController = new FavoritesProductsController()

favoritesRoutes.use(ensureAuthenticated)
favoritesRoutes.use(verifyUserAuthorization("client"))

favoritesRoutes.post("/:id", favoritesProductsController.create)
favoritesRoutes.delete("/:id", favoritesProductsController.delete)
favoritesRoutes.get("/", favoritesProductsController.index)

module.exports = favoritesRoutes
