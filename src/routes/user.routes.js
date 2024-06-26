const { Router } = require("express")

const UsersController = require("../controllers/UsersController")

const usersRoutes = Router()

const usersController = new UsersController()

usersRoutes.post("/", usersController.create)
usersRoutes.put("/", usersController.update)
usersRoutes.delete("/", usersController.delete)

module.exports = usersRoutes
