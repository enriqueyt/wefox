const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const port = parseInt(process.env.PORT || 3000);
const dbName = process.env.DB_PATH || 'db.test.json';
const geocodeUrl = 'config.json';
const geocodingAPI = process.env.GEOCODING_API;
const weatherAPI = process.env.WEATHER_API;

module.exports.port = port;
module.exports.dbPath = path.resolve(__dirname, dbName);
module.exports.geocodeConfig = path.resolve(__dirname, geocodeUrl);

module.exports.dbConfig = require(module.exports.dbPath);
module.exports.config = require(module.exports.geocodeConfig);
module.exports.geocodingAPI = geocodingAPI;
module.exports.geocodingUrl = module.exports.config.url;

module.exports.weatherURL = module.exports.config.weatherUrl;
module.exports.weatherAPI = weatherAPI;
