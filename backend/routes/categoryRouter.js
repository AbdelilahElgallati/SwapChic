const express = require("express");
const CategoryRouter = express.Router();
const CategoryController = require("../controllers/categoryController")

CategoryRouter.get( "/", CategoryController.getAllCategorys); 
CategoryRouter.get( "/:id", CategoryController.getOneCategory); 
CategoryRouter.post('/add',CategoryController.addCategory);
CategoryRouter.put('/edit/:id',CategoryController.updateCategory);
CategoryRouter.delete("/remove/:id",CategoryController.removeCategory);

module.exports = CategoryRouter;