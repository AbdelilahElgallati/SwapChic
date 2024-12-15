const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    name: { type: String, required: true },
    description: { type: String, required: true },
    condition: { type: String, required: true },
    price: { type: Number, required: true },
    photos: [{
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
    }],
    status: { type: String, enum: ['', '', ''], default: '' },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
