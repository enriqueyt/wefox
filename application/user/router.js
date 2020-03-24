const router = require('express').Router({});
const {wrap} = require('express-promise-wrap');
const {handleSignIn} = require('./handler');

router.get('/api/singin', wrap(handleSignIn));

module.exports = router;
