const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const config = require('../config');

const router = require('./router');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(router);

/**
 * entry point
 */
if (require.main === module) {
  app.listen(config.port, () => {
    console.log(__dirname);
    console.log('app listening on port', config.port);
  });
}

module.exports = app;
