const { Router } = require("express")

const FavoritesProductsController = require("../controllers/FavoritesProductsController")

const ensureAuthenticated = require("../middlewares/ensureAuthenticated")
const verifyUserAuthorization = require("../middlewares/verifyUserAuthorization")

const favoritesRoutes = Router()

const favoritesProductsController = new FavoritesProductsController()

favoritesRoutes.use(ensureAuthenticated)
favoritesRoutes.use(verifyUserAuthorization)

favoritesRoutes.post(
  "/:id",
  verifyUserAuthorization("client"),
  favoritesProductsController.create
)
favoritesRoutes.delete(
  ":id",
  verifyUserAuthorization("client"),
  favoritesProductsController.delete
)
favoritesRoutes.get(
  "/",
  verifyUserAuthorization("client"),
  favoritesProductsController.index
)

module.exports = favoritesRoutes
