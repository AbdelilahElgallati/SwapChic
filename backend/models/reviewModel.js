const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    revieweId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: {
      type: Number,
      required: true,
      min: 1, 
      max: 5,
    },
    comment: { type: String, required: true },
  },
  {timestamps: true}
);

const Review = mongoose.model('Review', ReviewSchema);

module.exports = Review;