const { Router } = require("express")
const multer = require("multer")
const uploadConfig = require("../configs/upload")

const ProductController = require("../controllers/ProductController")
const ProductMediaController = require("../controllers/ProductMediaController")

const ensureAuthenticated = require("../middlewares/ensureAuthenticated")
const verifyUserAuthorization = require("../middlewares/verifyUserAuthorization")

const productRoutes = Router()
const upload = multer(uploadConfig.MULTER)

const productController = new ProductController()
const productMediaController = new ProductMediaController()

productRoutes.use(ensureAuthenticated)

productRoutes.post(
  "/",
  verifyUserAuthorization("admin"),
  productController.create
)
productRoutes.patch(
  "/media/:id",
  verifyUserAuthorization("admin"),
  upload.single("media"),
  productMediaController.update
)
productRoutes.get("/", productController.index)
productRoutes.get("/:id", productController.show)
productRoutes.put("/:id", productController.update)
productRoutes.delete("/:id", productController.delete)

module.exports = productRoutes
