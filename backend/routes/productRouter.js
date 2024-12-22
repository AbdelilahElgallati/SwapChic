const express = require("express");
const ProductRouter = express.Router();
const ProductController = require("../controllers/productController")
const multer = require("multer");
const upload = multer({ dest: 'uploads/' });

ProductRouter.get( "/", ProductController.getAllProducts); 
ProductRouter.get( "/:id", ProductController.getOneProduct); 
ProductRouter.get( "/user/:id", ProductController.getAllProductsUser); 
ProductRouter.get( "/category/:id", ProductController.getAllProductsCategory); 
ProductRouter.post('/add',upload.single('photo'),ProductController.addProduct);
ProductRouter.put('/edit/:id', upload.array("photos"), ProductController.updateProduct);
ProductRouter.delete("/remove/:id",ProductController.removeProduct);

module.exports = ProductRouter;