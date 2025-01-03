const express = require("express");
const MessageRouter = express.Router();
const MessageController = require("../controllers/messageController")

MessageRouter.get("/receiver/:receiverId", MessageController.getSendersWithProducts);
MessageRouter.get("/client/:senderId", MessageController.getProductOwnersWithProducts);
MessageRouter.get( "/:connectedId/:receivedId/:productId", MessageController.getMessages); 
MessageRouter.get( "/:id", MessageController.getOneMessage); 
MessageRouter.get('/', MessageController.getMessages);
MessageRouter.get('/connections', MessageController.getUserConnections);
MessageRouter.post('/mark-delivered', MessageController.markMessagesAsDelivered);
MessageRouter.delete("/remove/:id",MessageController.removeMessage);

module.exports = MessageRouter;