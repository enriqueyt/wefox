const {Db} = require('../libs/applicationdb');
const {addressModel} = require('./address/model');

const db = Db
  .init()
  .register('address', addressModel);

module.exports = db;
