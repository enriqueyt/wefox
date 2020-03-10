const redis = require('redis');
const config = require('../../config');
const RedisModel = require('./model-redis');

class Redis {
  static async init() {
    const newOne = new Redis();
    const connection = await newOne.connect();
    return new RedisModel(connection);
  }

  async connect() {
    return redis.createClient({
      port: config.dbConfig.redis.port,
      host: config.dbConfig.redis.host
    });
  }
}

module.exports.Redis = Redis;
