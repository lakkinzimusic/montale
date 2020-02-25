const express = require("express");
const productController = require("../controllers/productController.js");
const productRouter = express.Router();
const jsonParser = express.json();
const bodyParser = require("body-parser");
// const multer = require('multer');


// const upload = multer({dest: './upload'});


productRouter.use("/get_all", productController.getAllProducts);

productRouter.post("/create",  productController.createProduct);
productRouter.get("/:id", productController.getOneProduct);
productRouter.delete("/:id", productController.deleteProduct);
productRouter.put("/:id", productController.updateProduct);

module.exports = productRouter;