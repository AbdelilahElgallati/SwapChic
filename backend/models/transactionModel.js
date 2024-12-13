const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TransactionSchema = new Schema(
  {
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    transactionType: { type: String, enum: ["", "", ""], default: "" },
    startdate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ["", "", ""], default: "" },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", TransactionSchema);

module.exports = Transaction;
