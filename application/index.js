const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const session = require('express-session');
const config = require('../config');
const passport = require('passport');
require('../libs/passport-config');

const errorHandler = require('../libs/api-error-handler');

const router = require('./router');
const addressRouter = require('./address/router');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'test',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers',
    'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(router);
app.use(addressRouter);
app.use(errorHandler());

if (require.main === module) {
  app.listen(config.port, () => {
    console.log(__dirname);
    console.log('app listening on port', config.port);
  });
}

module.exports = app;
