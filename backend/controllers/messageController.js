const Message = require("../models/messageModel");
const Product = require('../models/productModel'); // Remplacez par votre modèle Product
const axios = require('axios');

const getSendersWithProducts = async (req, res) => {
  const { receiverId } = req.params;
  console.log(req.params);

  try {
    const allMessages = await Message.find();
    console.log("all messages : ");
    console.log(allMessages);

    // Récupérer les messages uniquement pour le receiverId spécifié
    const messages = await Message.find({ receiverId: receiverId });

    // Extraire les utilisateurs uniques et leurs produits associés
    const senders = [];
    const senderProductMap = {};

    messages.forEach((messageDoc) => {
      if (messageDoc.receiverId === receiverId) { // Vérifier que le message est bien pour le receiverId
        if (!senders.includes(messageDoc.senderId)) {
          senders.push(messageDoc.senderId);
        }

        if (!senderProductMap[messageDoc.senderId]) {
          senderProductMap[messageDoc.senderId] = new Set(); // Utilisation d'un Set pour éviter les doublons
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
          .then((res) => ({ id: senderId, name: res.data.first_name }))
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
      products: senderProductMap[senderId].map((productId) =>
        productDetails.find((prod) => prod._id.toString() === productId)
      ),
    }));

    console.log(response);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching senders and products:", error);
    res.status(500).send("Error fetching senders and products");
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

// const updateMessage = async (req, res) => {
//   try {
//     const message = await Message.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     res.status(200).json({
//       success: true,
//       message,
//     });
//   } catch (error) {
//     res.status(500).send("Erreur serveur lors de la mise à jour de message");
//   }
// };

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
};
