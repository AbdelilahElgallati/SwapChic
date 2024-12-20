const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    photo: {
      type: String, 
      required: true,
    },
    phone: { type: String, required: true },
    localisation: { type: String, required: true },
    role: { type: String, default: "user" },
    isVerified: { type: Boolean },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
