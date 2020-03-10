const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
const {Auth} = require('../application/authentication');

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

function verifyClient(clientId, clientSecret, done) {
  return done(null, clientId);
}

passport.use(new ClientPasswordStrategy(verifyClient));

passport.use(new LocalStrategy(async(username, password, done) => {
  const myAuth = await Auth.init();
  await myAuth.authenticate(username, password, (err, data) => done(err, data));
}));

passport.use(new BearerStrategy(async(accessToken, done) => {
  const myAuth = await Auth.init();
  await myAuth.validate(accessToken, (err, data) => done(err, data));
}));
