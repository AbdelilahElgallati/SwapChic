const express = require("express");
const ProductRouter = express.Router();
const ProductController = require("../controllers/productController")
const multer = require("multer");
const upload = multer({ dest: 'uploads/' });

ProductRouter.get( "/", ProductController.getAllProducts); 
ProductRouter.get( "/:id", ProductController.getOneProduct); 
ProductRouter.get( "/user/:id", ProductController.getAllProductsUser); 
ProductRouter.get( "/category/:id", ProductController.getAllProductsCategory); 
ProductRouter.get( "/Search/:name", ProductController.getProductSearchName); 
ProductRouter.get( "/category/:idCategory/:idUser", ProductController.getAllProductsCategoryUser); 
ProductRouter.get( "/Search/:name/:id", ProductController.getProductSearchUserName);
ProductRouter.post('/add',upload.single('photo'),ProductController.addProduct);
ProductRouter.put('/edit/:id', upload.single('photo'), ProductController.updateProduct);
ProductRouter.delete("/remove/:id",ProductController.removeProduct);

module.exports = ProductRouter;