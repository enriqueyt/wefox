const router = require('express').Router({});
const passport = require('passport');
const {wrap} = require('express-promise-wrap');
const notifications = require('../../script/notification');
const {handleRequest} = require('./handler');

router.post('/api/login', passport.authenticate('local', {session: false}), wrap(handleRequest));

router.get('/api/auth', passport.authenticate('bearer', {session: false}), wrap(handleRequest));

router.get('/wefox/notifications', async(req, res, next) => {
  const response = notifications();
  res.send(response);
});

module.exports = router;
