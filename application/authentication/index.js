const {AuthModel} = require('./authModel');
const {User} = require('../user');

class Auth {
  constructor(authModel, modelUser) {
    this.authModel = authModel;
    this.modelUser = modelUser;
  }

  static async init() {
    const model = await AuthModel.init();
    const modelUser = await User.init();
    return new Auth(model, modelUser);
  }

  async authenticate(username, password, done) {
    const response = await this.modelUser.validateUser(username, password);
    if (response) {
      const token = await this.authModel.saveToken(response);
      return done(null, token);
    } else {
      return done(new Error('Wrong User or Password'));
    }
  }

  async validate(token, done) {
    const data = await this.authModel.getToken(token);
    const {name, email, postalCode, country, notification} = await this.modelUser.findUserById(data.id);
    return done(null, Object.assign({},
      {name: name, email: email, postalCode: postalCode, country: country, notification: notification},
      {accessToken: data.accessToken, id: data.id}));
  }
}

module.exports.Auth = Auth;
