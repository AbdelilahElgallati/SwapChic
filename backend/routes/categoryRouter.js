const express = require("express");
const CategoryRouter = express.Router();
const CategoryController = require("../controllers/categoryController")

CategoryRouter.get( "/product-count", CategoryController.getCategoriesWithProductCount); 
CategoryRouter.get( "/", CategoryController.getAllCategorys); 

CategoryRouter.get( "/product/:id", CategoryController.getCategoryById); 
CategoryRouter.get( "/:id", CategoryController.getOneCategory); 

CategoryRouter.get( "/Search/:name", CategoryController.getCategorySearchName); 


CategoryRouter.post('/add',CategoryController.addCategory);

CategoryRouter.put('/edit/:id',CategoryController.updateCategory);

CategoryRouter.delete("/remove/:id",CategoryController.removeCategory);

module.exports = CategoryRouter;