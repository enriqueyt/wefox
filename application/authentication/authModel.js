const {Redis} = require('../../libs/authenticationdb');
const crypto = require('crypto');

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
    const token = JSON.parse(strToken);
    return {
      accessToken: token.accessToken,
      accessTokenExpiresAt: token.accessTokenExpiresAt,
      refreshToken: token.refreshToken,
      refreshTokenExpiresAt: token.refreshTokenExpiresAt
    };
  }

  async saveToken(user) {
    const data = {
      accessToken: this.generateAuthorizationCode(),
      accessTokenExpiresAt: new Date(60 * 60 * 24),
      refreshToken: false,
      refreshTokenExpiresAt: 60 * 60 * 24,
      user: {
        id: user._id
      }
    };

    return this.redisInstance.set(data.accessToken, JSON.stringify(data));
  }

  async generateAuthorizationCode() {
    const seed = crypto.randomBytes(256);
    const code = crypto
      .createHash('sha1')
      .update(seed)
      .digest('hex');
    return code;
  }
}

module.exports.AuthModel = AuthModel;
