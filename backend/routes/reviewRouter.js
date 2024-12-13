const express = require("express");
const RevieweRouter = express.Router();
const RevieweController = require("../controllers/reviewController")

RevieweRouter.get( "/", RevieweController.getAllReviewes); 
RevieweRouter.get( "/:id", RevieweController.getOneReviewe); 
RevieweRouter.get( "/user/:id", RevieweController.getAllReviewesUser); 
RevieweRouter.get( "/sender/:id", RevieweController.getAllReviewesSender); 
RevieweRouter.post('/add',RevieweController.addReviewe);
RevieweRouter.put('/edit/:id',RevieweController.updateReviewe);
RevieweRouter.delete("/remove/:id",RevieweController.removeReviewe);

module.exports = RevieweRouter;