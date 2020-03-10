const db = require('../../application/db');
const {AuthModel} = require('./authModel');

class Auth {
  constructor(authModel, modelUser) {
    this.authModel = authModel;
    this.modelUser = modelUser;
  }

  static async init() {
    const model = await AuthModel.init();
    const dbInstanse = await db();
    const modelUser = dbInstanse.get('user');
    return new Auth(model, modelUser);
  }

  async authenticate(username, password, done) {
    const response = await this.modelUser.findOne({username: username});
    if (response) {
      if (response.password !== password) return done(new Error('Wrong credentials'));
      const token = await this.authModel.saveToken(response);
      return done(null, token);
    } else return done(new Error('Wrong User or Password'));
  }

  async validate(token, done) {
    const data = await this.authModel.getToken(token);
    return done(null, data);
  }
}

module.exports.Auth = Auth;
