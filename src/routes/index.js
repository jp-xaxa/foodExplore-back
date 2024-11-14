const { Router } = require("express")

const usersRoutes = require("./user.routes")
const sessionsRoutes = require("./sessions.routes")
const productRoutes = require("./product.routes")
const favoritesRoutes = require("./favorites.routes")
const ordersRoutes = require("./orders.routes")

const routes = Router()
routes.use("/users", usersRoutes)
routes.use("/sessions", sessionsRoutes)
routes.use("/product", productRoutes)
routes.use("/favorite", favoritesRoutes)
routes.use("/orders", ordersRoutes)

module.exports = routes
