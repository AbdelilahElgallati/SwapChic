const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  senderId: { 
    type: String, 
    required: true 
  },
  receiverId: { 
    type: String, 
    required: true 
  },
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  text: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'delivered', 'failed'], 
    default: 'pending' 
  },
}, {
  timestamps: true 
});


const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
