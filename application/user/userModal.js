const mongoose = require('mongoose');

const user = new mongoose.Schema({
  name: String,
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  postalCode: String,
  country: String
});

module.exports.userModel = mongoose.model('user', user);
