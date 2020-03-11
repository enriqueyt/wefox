const mongoose = require('mongoose');

const addressModel = new mongoose.Schema({
  street: String,
  formattedAddress: String,
  addressComponents: Array,
  streetNumber: String,
  town: String,
  postalCode: String,
  country: String,
  geometry: Array,
  placeId: String,
  expire: Number,
  user: String
});

module.exports.addressModel = mongoose.model('address', addressModel);
