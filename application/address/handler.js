const {Address} = require('./');

module.exports.handleAddressValidation = async(req, res) => {
  if (!req.user) {
    res.status(400).send(req.error);
  }
  const validateAddress = await Address.validate(req);
  res.status(200).send(validateAddress);
};

module.exports.handleAddressWeatherValidation = async(req, res) => {
  if (!req.user) {
    res.status(400).send(req.error);
  }
  const addressWeather = await Address.validateAddressWeather(req);
  res.status(200).json(addressWeather);
};

module.exports.handleWeatherValidation = async(req, res) => {
  if (!req.user) {
    res.status(400).send(req.error);
  }
  const weather = await Address.validateWeather(req);
  res.status(200).json(weather);
};
