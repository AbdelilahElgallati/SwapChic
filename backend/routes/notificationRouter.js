const express = require("express");
const NotificationRouter = express.Router();
const NotificationController = require("../controllers/notificationController")

NotificationRouter.get( "/", NotificationController.getAllnotifications); 
NotificationRouter.get( "/:id", NotificationController.getOneNotification); 
NotificationRouter.get( "/user/:id", NotificationController.getAllnotificationsUser); 
NotificationRouter.post('/add',NotificationController.addNotification);
NotificationRouter.put('/edit/:id',NotificationController.updateNotification);
NotificationRouter.delete("/remove/:id",NotificationController.removeNotification);

module.exports = NotificationRouter;