const Message = require("../models/messageModel");
const Product = require('../models/productModel'); // Remplacez par votre modèle Product
const axios = require('axios');

const getSendersWithProducts = async (req, res) => {
  const { receiverId } = req.params;

  try {
    const messages = await Message.find({ receiverId: receiverId });

    const senders = [];
    const senderProductMap = {};

    messages.forEach((messageDoc) => {
      if (messageDoc.receiverId === receiverId) { 
        if (!senders.includes(messageDoc.senderId)) {
          senders.push(messageDoc.senderId);
        }

        if (!senderProductMap[messageDoc.senderId]) {
          senderProductMap[messageDoc.senderId] = new Set(); 
        }

        senderProductMap[messageDoc.senderId].add(messageDoc.productId.toString()); // Ajout du produit
      }
    });

    // Conversion de tous les Sets en tableaux avant les opérations MongoDB
    Object.keys(senderProductMap).forEach((key) => {
      senderProductMap[key] = Array.from(senderProductMap[key]);
    });

    // Récupérer les détails des utilisateurs
    const clerck_key = process.env.CLERK_API_KEY;
    const userDetails = await Promise.all(
      senders.map((senderId) =>
        axios
          .get(`https://api.clerk.dev/v1/users/${senderId}`, {
            headers: { Authorization: `Bearer ${clerck_key}` },
          })
          .then((res) => ({ id: senderId, name: res.data.first_name, email: res.data.email_addresses[0].email_address }))

          .catch((err) => ({ id: senderId, name: "Unknown" }))
      )
    );

    // Récupérer les détails des produits
    const productIds = [...new Set(Object.values(senderProductMap).flat())]; // Obtenir tous les IDs de produit uniques
    const productDetails = await Product.find({
      _id: { $in: productIds }, // Utilisation correcte d'un tableau
    });

    // Construire la réponse finale
    const response = senders.map((senderId) => ({
      senderId,
      senderName: userDetails.find((user) => user.id === senderId)?.name || "Unknown",
      senderEmail: userDetails.find((user) => user.id === senderId)?.email || "Unknown",
      products: senderProductMap[senderId].map((productId) =>
        productDetails.find((prod) => prod._id.toString() === productId)
      ),
    }));

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching senders and products:", error);
    res.status(500).send("Error fetching senders and products");
  }
};

const getProductOwnersWithProducts = async (req, res) => {
  const { senderId } = req.params;

  try {
    const messages = await Message.find({ senderId });

    const receivers = [];
    const receiverProductMap = {};

    messages.forEach((messageDoc) => {
      if (messageDoc.senderId === senderId) {
        if (!receivers.includes(messageDoc.receiverId)) {
          receivers.push(messageDoc.receiverId);
        }

        if (!receiverProductMap[messageDoc.receiverId]) {
          receiverProductMap[messageDoc.receiverId] = new Set();
        }

        receiverProductMap[messageDoc.receiverId].add(messageDoc.productId.toString());
      }
    });

    Object.keys(receiverProductMap).forEach((key) => {
      receiverProductMap[key] = Array.from(receiverProductMap[key]);
    });

    // Récupérer les détails des utilisateurs (product owners)
    const clerck_key = process.env.CLERK_API_KEY;
    const userDetails = await Promise.all(
      receivers.map((receiverId) =>
        axios
          .get(`https://api.clerk.dev/v1/users/${receiverId}`, {
            headers: { Authorization: `Bearer ${clerck_key}` },
          })
          .then((res) => ({ id: receiverId, name: res.data.first_name, email: res.data.email_addresses[0].email_address }))
          // .then((res) => (console.log(res.data.email_addresses[0].email_address)))
          .catch(() => ({ id: receiverId, name: "Unknown", email: "Unknown" }))
      )
      // 
    );

    // Récupérer les détails des produits
    const productIds = [...new Set(Object.values(receiverProductMap).flat())];
    const productDetails = await Product.find({
      _id: { $in: productIds },
    });

    const response = receivers.map((receiverId) => ({
      receiverId,
      receiverName: userDetails.find((user) => user.id === receiverId)?.name || "Unknown",
      receiverEmail: userDetails.find((user) => user.id === receiverId)?.email || "Unknown",
      products: receiverProductMap[receiverId].map((productId) =>
        productDetails.find((prod) => prod._id.toString() === productId)
      ),
    }));

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching product owners and products:", error);
    res.status(500).send("Error fetching product owners and products");
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


const removeMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    res.status(201).json(message);
  } catch (error) {
    res.status(500).send("Erreur serveur lors de la suppression de message");
  }
};


const getMessages = async (req, res) => {

  try {
    const { productId, clientId, productOwnerId } = req.query;
    
    const messages = await Message.find({
      productId,
      $or: [
        { senderId: clientId, receiverId: productOwnerId },
        { senderId: productOwnerId, receiverId: clientId }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Error fetching messages' });
  }
};

const getUserConnections = async (req, res) => {

  try {
    const { messageId, senderId, receiverId, productId } = req.body;
    
    await Message.updateMany(
      {
        productId,
        senderId,
        receiverId,
        status: 'pending'
      },
      {
        $set: { status: 'delivered' }
      }
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error in markMessagesAsDelivered:', error);
    res.status(500).json({ error: 'Error marking messages as delivered' });
  }
};

const markMessagesAsDelivered = async () => {
  try {
    const { senderId, receiverId, productId } = req.body;
    
    await Message.updateMany(
      {
        productId,
        senderId,
        receiverId,
        status: 'pending'
      },
      {
        $set: { status: 'delivered' }
      }
    );
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error marking messages as delivered' });
  }
};

module.exports = {
  getMessages,
  getOneMessage,
  removeMessage,
  getSendersWithProducts,
  getUserConnections,
  markMessagesAsDelivered,
  getProductOwnersWithProducts,
};
