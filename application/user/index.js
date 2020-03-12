const bcrypt = require('bcrypt');
const db = require('../db');

class User {
  constructor(dbInstanse) {
    this.model = dbInstanse.get('user');
  }

  static async init() {
    const dbInstanse = await db();
    return new User(dbInstanse);
  }

  async createUser(req) {
    const newPassword = await this.encryptPassword(req.password);
    const document = Object.assign({}, req, {password: newPassword});
    const userModel = this.mapUserModel(document);
    return this.model.create(userModel);
  }

  async findUserById(id) {
    return this.model.findOne({_id: id});
  }

  async findUserByUsername(username) {
    return this.model.findOne({username: username});
  }

  async editAccount(req, res) {
    const {currentDocument, propertiesToUpdated} = req.body;
    const userToUpdate = this.mapUserModel(currentDocument, propertiesToUpdated);
    return this.model.updateOne(userToUpdate);
  }

  async encryptPassword(password) {
    return bcrypt.hashSync(password, 10);
  }

  async comparePassword(password, passwordHash) {
    return bcrypt.compare(password, passwordHash);
  }

  async validateUser(username, password) {
    const response = await this.findUserByUsername(username);
    const isMatchPassword = await this.comparePassword(password, response.password);
    if (!isMatchPassword) {
      return null;
    }

    const {name, email, postalCode, country, notification, _id} = response;

    return {
      _id: _id.toString(),
      name,
      username,
      email,
      postalCode,
      country,
      notification
    };
  }

  mapUserModel(currentDocument, updatedProperties = {}) {
    const {name, username, password, email, postalCode, country, notification} = currentDocument;

    return Object.assign({}, {
      name: name,
      username: username,
      password: password,
      email: email,
      postalCode: postalCode,
      country: country,
      notification: notification
    }, updatedProperties);
  }
}

module.exports.User = User;
