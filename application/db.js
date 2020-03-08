const {Db} = require('../libs/applicationdb');
const Address = require('./address/model');

const db = Db
  .init()
  .register('address', Address);

module.exports = db;
