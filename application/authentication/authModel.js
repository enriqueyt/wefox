const {Redis} = require('../../libs/authenticationdb');
const crypto = require('crypto');
const moment = require('moment');

class AuthModel {
  constructor(redisInstance) {
    this.redisInstance = redisInstance;
  }

  static async init() {
    const redisInstance = await Redis.init();
    return new AuthModel(redisInstance);
  }

  async getToken(bearerToken) {
    const strToken = await this.redisInstance.get(bearerToken);
    if (!strToken) {
      return new Error('Need login');
    }
    const {accessToken, accessTokenExpiresAt, user} = JSON.parse(strToken);

    if (this.isTokenExpire(accessTokenExpiresAt)) {
      return new Error('Please login again');
    }
    return {
      accessToken,
      accessTokenExpiresAt,
      notification: user.notification,
      id: user.id
    };
  }

  isTokenExpire(accessTokenExpiresAt) {
    return accessTokenExpiresAt < moment().utc().unix();
  }

  async saveToken(user) {
    const expires = moment().utc().add({hours: 10}).unix();

    const data = {
      accessToken: this.generateAuthorizationCode(),
      accessTokenExpiresAt: expires,
      user: {
        id: user._id,
        notification: user.notification
      }
    };

    const result = this.redisInstance.set(data.accessToken, JSON.stringify(data));
    if (result) return data.accessToken;
    throw new Error('Error save credentials');
  }

  generateAuthorizationCode() {
    const seed = crypto.randomBytes(256);
    const code = crypto
      .createHash('sha1')
      .update(seed)
      .digest('hex');
    return code;
  }
}

module.exports.AuthModel = AuthModel;
