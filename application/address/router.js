const router = require('express').Router({});
const passport = require('passport');
const {Address} = require('./');

router.get('/address', function(req, res) {
  res.status(200).send('Address');
});

router.get('/api/address/validate', passport.authenticate('bearer', {session: false}), async(req, res, next) => {
  if (!req.user) {
    res.status(400).send(req.error);
  }
  const validateAddress = await Address.validate(req);
  res.status(200).send(validateAddress);
});

router.post('/api/address', passport.authenticate('bearer', {session: false}), async(req, res, next) => {
  if (!req.user) {
    res.status(400).send(req.error);
  }
  const addressWeather = await Address.validateAddressWeather(req);
  res.status(200).json(addressWeather);
});

router.post('/api/weather', passport.authenticate('bearer', {session: false}), async(req, res, next) => {
  if (!req.user) {
    res.status(400).send(req.error);
  }
  const weather = await Address.validateWeather(req);
  res.status(200).json(weather);
});

module.exports = router;
