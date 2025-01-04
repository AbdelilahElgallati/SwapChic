const Transaction = require("../models/transactionModel")

const addTransaction = async (req, res) => {
  try {
    const {senderId, receiverId, productId, status} = req.body;
    const transaction = new Transaction({
      senderId, receiverId, productId, status
    });
    await transaction.save();
    res.status(200).json({
      success: true,
      transaction,
    });
  } catch (error) {
    console.log(error)
    res.status(500).send("Erreur serveur lors de l'ajout du transaction");
  }
}

const getAlltransactions = async (req, res) => {
    try {
      const transactions = await Transaction.find();
      res.status(201).json(transactions);
    } catch (error) {
      res.status(500).send("Erreur serveur lors de la recherche des transactions");
    }
}

const getAlltransactionsClient = async (req, res) => {
  try {
    const transactions = await Transaction.find({ senderId: req.params.id }).populate("productId");
    // console.log(transactions)
    res.status(201).json(transactions);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la recherche des transactions");
  }
}

const getAlltransactionsProductOwner = async (req, res) => {
  // console.log(req.params)
  try {
    const transactions = await Transaction.find({ receiverId: req.params.id }).populate("productId");
    // console.log(transactions)
    res.status(201).json(transactions);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la recherche des transactions");
  }
}

const  getOneTransaction = async (req, res) => {
  try {
    const  transaction = await Transaction.findById(req.params.id);
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la recherche de transaction");
  }
}

const  updateTransaction = async (req,res)=>{
  try {
    const  transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.status(200).json({
      success: true,
      transaction,
    });
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la mise à jour de transaction");
  }
}

const  removeTransaction = async (req, res) => {
  try {
    const  transaction = await Transaction.findByIdAndDelete(req.params.id);
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la suppression de transaction");
  }
}

module.exports = {addTransaction,getAlltransactions,getAlltransactionsClient,getAlltransactionsProductOwner,getOneTransaction,updateTransaction,removeTransaction};