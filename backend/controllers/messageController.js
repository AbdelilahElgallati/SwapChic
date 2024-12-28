const Message = require("../models/messageModel");

const addMessage = async (req, res) => {
  try {
    // const {senderId, receiverId, content} = req.body;
    const MessageData = req.body.message;
    const Message = new Message(MessageData);
    await Message.save();
    res.status(200).json({
      success: true,
      Message,
    });
  } catch (error) {
    res.status(500).send("Erreur serveur lors de l'ajout du message");
  }
};

const getAllmessages = async (req, res) => {
  try {
    const messages = await Message.find();
    res.status(201).json(messages);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la recherche des messages");
  }
};

const getMessages = async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;
    const messages = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la recherche des messages");
  }
};

const getAllmessagesReceiver = async (req, res) => {
  try {
    const messages = await Message.find({ receiverId: req.params.id });
    res.status(201).json(messages);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la recherche des messages");
  }
};

const getAllmessagesSender = async (req, res) => {
  try {
    const messages = await Message.find({ senderId: req.params.id });
    res.status(201).json(messages);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la recherche des messages");
  }
};

const getOneMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    res.status(201).json(message);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la recherche de message");
  }
};

const updateMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({
      success: true,
      message,
    });
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la mise à jour de message");
  }
};

const removeMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    res.status(201).json(message);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la suppression de message");
  }
};

module.exports = {
  addMessage,
  getAllmessages,
  getMessages,
  getAllmessagesReceiver,
  getAllmessagesSender,
  getOneMessage,
  updateMessage,
  removeMessage,
};
