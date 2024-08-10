const { Router } = require("express")

const usersRoutes = require("./user.routes")
const sessionsRouter = require("./sessions.routes")
const productRoutes = require("./product.routes")

const routes = Router()
routes.use("/users", usersRoutes)
routes.use("/sessions", sessionsRouter)
routes.use("/product", productRoutes)

module.exports = routes
