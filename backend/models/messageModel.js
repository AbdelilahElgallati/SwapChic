// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const MessageSchema = new Schema(
//   {
//     productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
//     messages: [
//       {
//         sender: { type: String, required: true },
//         receiver: { type: String, required: true },
//         content: { type: String, required: true },
//         timestamp: { type: Date, default: Date.now },
//       },
//     ],
//   },
//   { timestamps: true }
// );

// const Message = mongoose.model('Message', MessageSchema);

// module.exports = Message;

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

// Add indexes for better query performance
messageSchema.index({ senderId: 1, receiverId: 1, productId: 1 });
messageSchema.index({ createdAt: -1 }); // For sorting by date

// Add a method to mark message as delivered
messageSchema.methods.markAsDelivered = function() {
  this.status = 'delivered';
  return this.save();
};

// Add a method to mark message as read
messageSchema.methods.markAsRead = function() {
  this.readAt = new Date();
  return this.save();
};

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
