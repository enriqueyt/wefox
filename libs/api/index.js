const Model = require('./model');

class Api {
  constructor() {
    this.customModels = {};
  }

  static init() {
    const newOne = new Api();
    return newOne;
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

module.exports.Api = Api;
