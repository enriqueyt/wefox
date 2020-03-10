const OAuth2Model = require('./model-auth').getInstance();
const OAuth2Server = require('oauth2-server');
const Request = OAuth2Server.Request;
const Response = OAuth2Server.Response;

class OAuth2 {
  constructor() {
    this.oAuth2 = new OAuth2Server({
      model: OAuth2Model,
      grants: ['authorization_code', 'refresh_token'],
      accessTokenLifetime: 60 * 60 * 24, // 24 hours, or 1 day
      allowEmptyState: true,
      allowExtendedTokenAttributes: true
    });
  }

  static init() {
    return new OAuth2();
  }

  getToken(req, res) {
    const request = new Request(req);
    const response = new Response(res);
    return this.oAuth2.token(request, response)
      .then(function(token) {
        console.log('token', token);
        res.json(token);
      }).catch(function(err) {
        res.status(err.code || 500).json(err);
      });
  }

  authenticateRequest(req, res, next) {
    const request = new Request(req);
    const response = new Response(res);
    return this.oAuth2.authenticate(request, response)
      .then(function(token) {
        console.log('the request was successfully authenticated');
        next();
      }).catch(function(err) {
        res.status(err.code || 500).json(err);
      });
  }
}

module.exports.OAuth2 = OAuth2.init();
