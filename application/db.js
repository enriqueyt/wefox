const {Db} = require('../libs/applicationdb');
const {addressModel} = require('./address/addressModel');
const {userModel} = require('./user/userModal');

const db = async() => {
  const myDb = await Db.init();
  myDb.register('address', addressModel)
    .register('user', userModel);
  return myDb;
};

module.exports = db;
