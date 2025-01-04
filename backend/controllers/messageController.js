const Message = require("../models/messageModel");
const Product = require('../models/productModel'); // Remplacez par votre modèle Product
const axios = require('axios');

const getSendersWithProducts = async (req, res) => {
  const { receiverId } = req.params;

  try {
    // Récupérer les produits appartenant à l'utilisateur connecté
    const userProducts = await Product.find({ userId: receiverId });

    // Extraire les IDs des produits de l'utilisateur
    const userProductIds = new Set(userProducts.map((product) => product._id.toString()));

    // Récupérer les messages où l'utilisateur est le receiver et qui concernent ses produits
    const messages = await Message.find({ 
      receiverId, 
      productId: { $in: [...userProductIds] } 
    });

    const senders = [];
    const senderProductMap = {};

    messages.forEach((messageDoc) => {
      const senderId = messageDoc.senderId;
      const productId = messageDoc.productId.toString();

      if (!senders.includes(senderId)) {
        senders.push(senderId);
      }

      if (!senderProductMap[senderId]) {
        senderProductMap[senderId] = new Set();
      }

      senderProductMap[senderId].add(productId);
    });

    // Convertir les sets en tableaux
    Object.keys(senderProductMap).forEach((key) => {
      senderProductMap[key] = Array.from(senderProductMap[key]);
    });

    // Récupérer les détails des utilisateurs (clients qui ont envoyé un message)
    const clerck_key = process.env.CLERK_API_KEY;
    const userDetails = await Promise.all(
      senders.map((senderId) =>
        axios
          .get(`https://api.clerk.dev/v1/users/${senderId}`, {
            headers: { Authorization: `Bearer ${clerck_key}` },
          })
          .then((res) => ({
            id: senderId,
            name: res.data.first_name,
            email: res.data.email_addresses[0].email_address,
          }))
          .catch(() => ({
            id: senderId,
            name: "Unknown",
            email: "Unknown",
          }))
      )
    );

    // Construire la réponse avec les produits de l'utilisateur concernés
    const response = senders.map((senderId) => ({
      senderId,
      senderName: userDetails.find((user) => user.id === senderId)?.name || "Unknown",
      senderEmail: userDetails.find((user) => user.id === senderId)?.email || "Unknown",
      products: senderProductMap[senderId].map((productId) =>
        userProducts.find((prod) => prod._id.toString() === productId)
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
    // Récupérer les messages envoyés par l'utilisateur
    const messages = await Message.find({ senderId });

    // Récupérer les produits associés aux messages
    const productIds = [...new Set(messages.map(msg => msg.productId.toString()))];
    const products = await Product.find({ _id: { $in: productIds } });

    // Filtrer les produits qui n'appartiennent pas à l'utilisateur connecté
    const filteredProducts = products.filter(product => product.userId !== senderId);

    // Regrouper les produits par propriétaire
    const productOwnerMap = {};
    filteredProducts.forEach(product => {
      if (!productOwnerMap[product.userId]) {
        productOwnerMap[product.userId] = [];
      }
      productOwnerMap[product.userId].push(product);
    });

    // Récupérer les informations des propriétaires
    const clerck_key = process.env.CLERK_API_KEY;
    const userDetails = await Promise.all(
      Object.keys(productOwnerMap).map(ownerId =>
        axios
          .get(`https://api.clerk.dev/v1/users/${ownerId}`, {
            headers: { Authorization: `Bearer ${clerck_key}` },
          })
          .then(res => ({
            id: ownerId,
            name: res.data.first_name || "Unknown",
            email: res.data.email_addresses[0]?.email_address || "Unknown",
          }))
          .catch(() => ({ id: ownerId, name: "Unknown", email: "Unknown" }))
      )
    );

    // Construire la réponse
    const response = userDetails.map(user => ({
      receiverId: user.id,
      receiverName: user.name,
      receiverEmail: user.email,
      products: productOwnerMap[user.id] || [],
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
