
class RedisModal {
  constructor(model) {
    this.Model = model;
  }

  async set(key, value) {
    this.expire(value);
    return this.Model.set(key, value);
  }

  async get(key) {
    return new Promise((resolve, reject) => {
      this.Model.get(key, (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  }

  async destroy(key) {
    return this.Model.del(key);
  }

  expire(valueSession) {
    this.Model.expire(valueSession, 60 * 60 * 2);
  }
}

module.exports = RedisModal;
