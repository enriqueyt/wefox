
const statuses = require('statuses');
const production = process.env.NODE_ENV === 'production';

module.exports = function() {
  const apiErrorHandler = (err, req, res, next) => {
    let status = err.status || err.statusCode || 500;
    if (status < 400) status = 500;
    res.statusCode = status;

    const body = {
      status: status
    };

    if (!production) body.stack = err.stack;

    // internal server errors
    if (status >= 500) {
      console.error(err.stack);
      body.message = statuses[status];
      res.json(body);
      return;
    }

    // client errors
    body.message = err.message;
    body.responseText = body.message;

    if (err.code) body.code = err.code;
    if (err.name) body.name = err.name;
    if (err.type) body.type = err.type;
    if (err.inputElement) body.inputElement = err.inputElement;

    res.json(body);
  };

  return apiErrorHandler;
};
