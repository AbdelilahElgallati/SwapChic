const express = require("express");
const LikeRouter = express.Router();
const LikeController = require("../controllers/likeController")

LikeRouter.get( "/favories/:userId", LikeController.getAllLikesUserId); 
LikeRouter.get( "/:id", LikeController.getOneLike); 
LikeRouter.get( "/user/:id", LikeController.getAllLikesUser);
LikeRouter.get( "/:userId/:productId", LikeController.getOneLikeByProductIdAndUserId); 
LikeRouter.post('/add',LikeController.addLike);
LikeRouter.delete("/remove/:id",LikeController.removeLike);

module.exports = LikeRouter;