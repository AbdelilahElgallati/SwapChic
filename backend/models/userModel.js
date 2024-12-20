const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    photo: { type: Buffer }, 
    phone: { type: String },
    localisation: { type: String},
    role: { type: String, default: 'user'},
    isVerified: { type: Boolean },
  },
  {timestamps: true}
);

const User = mongoose.model('User', UserSchema);

module.exports = User;