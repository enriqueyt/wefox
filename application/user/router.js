const router = require('express').Router({});
const {User} = require('./');

router.get('/api/singin', async(req, res, next) => {
  const myUser = await User.init();
  const user = {
    name: req.name,
    username: req.username,
    password: req.password,
    email: req.email,
    postalCode: req.postalCode,
    country: req.country,
    notification: req.notification
  };

  const newUser = await myUser.createUser(user);
  res.status(200).send(newUser);
});

module.exports = router;
