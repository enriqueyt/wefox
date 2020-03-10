const {Redis} = require('../../libs/authenticationdb');
const crypto = require('crypto');

class OAuth2Model {
  constructor(redisInstance) {
    this.redisInstance = redisInstance;
  }

  static async init() {
    const redisInstance = await Redis.init();
    return new OAuth2Model(redisInstance);
  }

  async getUser(username, password) {
    const user = await this.redisInstance.get(username);
    if (!user || password !== user.password) {
      return;
    }
    return {
      id: user.id,
      username: user.username,
      password: user.password,
      grants: ['password', 'refresh_token']
    };
  }

  async getToken(bearerToken) {
    const token = await this.redisInstance.get(bearerToken);
    if (!token || token.accessToken !== bearerToken) {
      return;
    }
    return {
      accessToken: new Date(token.accessToken),
      accessTokenExpiresAt: new Date(token.accessTokenExpiresAt),
      refreshToken: token.refreshToken,
      refreshTokenExpiresAt: token.refreshTokenExpiresAt,
      client: {
        id: token.clientId
      },
      user: {
        id: token.userId
      }
    };
  }

  async saveToken(paramToken, user) {
    const data = {
      accessToken: this.generateAuthorizationCode(),
      accessTokenExpiresAt: new Date(paramToken.accessTokenExpiresAt),
      refreshToken: paramToken.refreshToken,
      refreshTokenExpiresAt: new Date(paramToken.refreshTokenExpiresAt),
      user: {
        id: user.id
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

module.exports.OAuth2Model = OAuth2Model.init();
