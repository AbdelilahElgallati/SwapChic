const express = require("express");
const TransactionRouter = express.Router();
const TransactionController = require("../controllers/transactionController")

TransactionRouter.get( "/", TransactionController.getAlltransactions); 
TransactionRouter.get( "/:id", TransactionController.getOneTransaction); 
TransactionRouter.get( "/sender/:id", TransactionController.getAlltransactionsClient); 
TransactionRouter.get( "/reciever/:id", TransactionController.getAlltransactionsProductOwner); 
TransactionRouter.post('/add',TransactionController.addTransaction);
TransactionRouter.put('/edit/:id',TransactionController.updateTransaction);
TransactionRouter.delete("/remove/:id",TransactionController.removeTransaction);

module.exports = TransactionRouter;