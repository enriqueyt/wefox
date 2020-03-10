const router = require('express').Router({});
const passport = require('passport');
router.get('/', function(req, res) {
  res.status(200).send('Wefox');
});

router.post('/api/login', passport.authenticate('local', {session: false}), async(req, res, next) => {
  if (!req.user) {
    res.status(400).send(req.error);
  }
  res.status(200).send(req.user);
});

router.get('/api/auth', passport.authenticate('bearer', {session: false}), async(req, res, next) => {
  if (!req.user) {
    res.status(400).send(req.error);
  }
  res.status(200).send(req.user);
});

module.exports = router;
