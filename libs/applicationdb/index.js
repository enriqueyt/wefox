const mongoose = require('mongoose');
const config = require('../../config');
const Model = require('./model');

class Db {
  constructor() {
    this.customModels = {};
  }

  static async init() {
    const newOne = new Db();
    await newOne.connect();
    return newOne;
  }

  async connect() {
    return mongoose.connect(config.dbConfig.dbUrl, {useNewUrlParser: true});
  }

  register(modelName, ModelClass) {
    if (this.customModels[modelName]) throw new Error('Model already exist');
    this.customModels[modelName] = ModelClass;
    return this;
  }

  get(modelName) {
    return this.getModel(modelName);
  }

  getModel(modelName) {
    const model = this.customModels[modelName];
    return new Model(model);
  }
}

module.exports.Db = Db;
