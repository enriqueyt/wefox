
class ModelDb {
  constructor(model) {
    this.Model = model;
  }

  async create(document) {
    const newRegister = new this.Model(document);
    return this.Model.create(newRegister);
  }

  async findPopulate(options = {}, model) {
    return this.Model.find(options).populate(model).lean().exec();
  }

  async findOne(options = {}) {
    return this.Model.findOne(options).lean().exec();
  }

  async find(options = {}) {
    return this.Model.find(options).lean().exec();
  }

  async updateOne(id, options) {
    return this.Model.findOneAndUpdate({
      _id: id
    }, options, {upsert: true}).lean().exec();
  }

  async delete(_id) {
    return this.Model.deleteOne({_id: _id});
  }
}

module.exports = ModelDb;
