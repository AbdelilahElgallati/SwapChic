const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    userId: { type: String, required: true },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    name: { type: String, required: true },
    description: { type: String, required: true },
    condition: { type: String },
    price: { type: Number, required: true },
    photo: { type: String, required: true},
    type: {type: String, enum: ['Gift', 'Sale', 'Exchange'], default: 'Sale'},
    status: { type: String, enum: ['Published', 'Sold'], default: 'Published' },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
