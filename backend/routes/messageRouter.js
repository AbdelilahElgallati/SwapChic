const express = require("express");
const MessageRouter = express.Router();
const MessageController = require("../controllers/messageController")

MessageRouter.get( "/", MessageController.getAllmessages); 
MessageRouter.get( "/:senderId/:receiverId", MessageController.getMessages); 

MessageRouter.get( "/:id", MessageController.getOneMessage); 
MessageRouter.get( "/receiver/:id", MessageController.getAllmessagesReceiver); 
MessageRouter.get( "/sender/:id", MessageController.getAllmessagesSender); 
MessageRouter.post('/add',MessageController.addMessage);
MessageRouter.put('/edit/:id',MessageController.updateMessage);
MessageRouter.delete("/remove/:id",MessageController.removeMessage);

module.exports = MessageRouter;