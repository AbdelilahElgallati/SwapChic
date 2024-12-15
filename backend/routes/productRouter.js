const express = require("express");
const ProductRouter = express.Router();
const ProductController = require("../controllers/productController")
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Remplacez 'uploads/' par le chemin désiré
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });
  const upload = multer({ storage });

ProductRouter.get( "/", ProductController.getAllProducts); 
ProductRouter.get( "/:id", ProductController.getOneProduct); 
ProductRouter.get( "/user/:id", ProductController.getAllProductsUser); 
ProductRouter.get( "/category/:id", ProductController.getAllProductsCategory); 
ProductRouter.post('/add',ProductController.addProduct);
ProductRouter.put('/edit/:id', upload.array("photos"), ProductController.updateProduct);
ProductRouter.delete("/remove/:id",ProductController.removeProduct);

module.exports = ProductRouter;