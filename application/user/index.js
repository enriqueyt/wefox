const {db} = require('../index');

class User {
  constructor() {
    this.model = db.get('user');
  }

  static init() {
    return new User();
  }

  async addUser(req, res) {
    const userModel = this.getAccountModel(req.body);
    const newUser = await this.model.create(userModel);
    res.json(newUser);
  }

  async getUser(req, res) {
    const {id} = req.params.id;
    const currentAccount = await this.model.findOne({_id: id});
    res.json(currentAccount);
  }

  async editAccount(req, res) {
    const {currentDocument, propertiesToUpdated} = req.body;
    const userToUpdate = this.mapUserModel(currentDocument, propertiesToUpdated);
    const userUpdate = await this.model.updateOne(userToUpdate);
    res.json(userUpdate);
  }

  mapUserModel(currentDocument, updatedProperties = {}) {
    const {name, username, type, password, email, postalCode, country} = currentDocument;

    return Object.assign({}, {
      name: name,
      username: username,
      type: type,
      password: password,
      email: email,
      postalCode: postalCode,
      country: country
    }, updatedProperties);
  }
}

module.exports = User.init();
