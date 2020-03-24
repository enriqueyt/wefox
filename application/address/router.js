const router = require('express').Router({});
const {wrap} = require('express-promise-wrap');
const passport = require('passport');
const {handleAddressValidation, handleAddressWeatherValidation, handleWeatherValidation} = require('./handler');

router.get('/address', function(req, res) {
  res.status(200).send('Address');
});

router.get('/api/address/validate',
  passport.authenticate('bearer', {session: false}), wrap(handleAddressValidation));

router.get('/api/address',
  passport.authenticate('bearer', {session: false}), wrap(handleAddressWeatherValidation));

router.get('/api/weather',
  passport.authenticate('bearer', {session: false}), wrap(handleWeatherValidation));

module.exports = router;
