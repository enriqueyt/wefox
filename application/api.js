const {Api} = require('../libs/api');
const {geocodingAPI, geocodingUrl, weatherURL, weatherAPI} = require('../config');
const weather = {url: weatherURL, options: {appid: weatherAPI}};
const goecoding = {url: geocodingUrl, options: {key: geocodingAPI}};

const api = Api.init()
  .register('goecoding', goecoding)
  .register('weather', weather);

module.exports = api;
