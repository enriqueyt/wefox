import mongoose from 'mongoose';

const addressModel = new mongoose.Schema({
  street: String,
  streetNumber: String,
  town: String,
  postalCode: String,
  country: String
});

module.exports.addressModel = mongoose.model('address', addressModel);
