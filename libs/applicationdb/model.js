
class ModelDb {
  constructor(model) {
    this.Model = model;
  }

  async findMany(options = {}) {
    return this.Model.find().lean().exec();
  }

  async find(options = {}) {
    return this.Model.find(options).lean().exec();
  }

  async updateOne(id, options) {
    return this.Model.findOneAndUpdate({
      _id: id
    }, options, {upsert: true}).lean().exec();
  }

  async create(document) {
    const newRegister = new this.Model(document);
    const result = await this.Model.save(newRegister);
    return result;
  }
}

module.exports = ModelDb;
