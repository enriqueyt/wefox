const path = require('path');
const port = parseInt(process.env.PORT || 3000);
const dbName = process.env.DB_PATH || 'db.test.json';

module.exports.port = port;
module.exports.dbPath = path.resolve(__dirname, dbName);

module.exports.dbConfig = require(module.exports.dbPath);
