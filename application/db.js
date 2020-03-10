const {Db} = require('../libs/applicationdb');
const {addressModel} = require('./address/addressModel');
const {userModel} = require('./user/userModal');

const db = Db.init()
  .register('address', addressModel)
  .register('user', userModel);

module.exports = db;
