const mongoose = require('mongoose');
const schema = mongoose.Schema;

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
  userToken: String,
  notification: Boolean,
  user: {
    type: schema.Types.ObjectId,
    ref: 'user'
  }
});

module.exports.addressModel = mongoose.model('address', addressModel);
