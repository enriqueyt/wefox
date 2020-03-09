const expect = require('chai').expect;
const assert = require('assert');
const sinon = require('sinon');
const {Db} = require('../../../libs/applicationdb/index');
const {addressModel} = require('../../../application/address/addressModel');

describe('lib application db', () => {
  before('global stub', () => {
    this.newInstanseDb = null;
    const mockDbConnection = {
      connections: [],
      _pluralize: {},
      models: {},
      modelSchemas: {},
      options: {},
      Schema: {},
      model: [],
      plugins: []
    };
    sinon.stub(Db.prototype, 'connect').callsFake(async() => Promise.resolve(mockDbConnection));
  });

  describe('functionalities basic of the db library', () => {
    it('should create new wefox db instance', async() => {
      this.newInstanseDb = await Db.init();
      if (this.newInstanseDb instanceof Db) {
        assert('well created an db instance');
      } else {
        assert.fail('model is not a instance of [Db]');
      }
    });

    it('should register new model', () => {
      this.newRegisterModel = this.newInstanseDb.register('address', addressModel);
      expect(this.newRegisterModel).to.have.keys('customModels');
      expect(this.newRegisterModel.customModels.address).not.to.be.an('undefined');
      expect(typeof this.newRegisterModel.customModels.address).to.be.equal('function');
    });

    it('should get the model registered', () => {
      const myModel = this.newRegisterModel.get('address');
      expect(myModel).to.have.keys('Model');
      assert.strict.notEqual(myModel, undefined);
    });
  });

  describe('oricess to user the library in the applition', () => {
    before('instanciate db application', () => {
      this.newRegisterModel = null;
      this.myModel = null;
      this._idExpected = '5e659c707c6929c2f95dc86a';
      const newRecordcors = [{
        _id: '5e659c707c6929c2f95dc86a',
        street: 'Fellow court',
        streetNumber: '4',
        town: 'Hackney',
        postalCode: 'E2 8JL',
        country: 'UK',
        __v: 0
      }];
      const recordUpdated = {
        _id: '5e659c707c6929c2f95dc86a',
        street: 'Fellow court',
        streetNumber: '7',
        town: 'Hackney Park',
        postalCode: 'E2 8JL',
        country: 'UK',
        __v: 0
      };
      sinon.stub(Db, 'init').callsFake(async() => {
        return Promise.resolve({
          register: (name, model) => {
            return {
              get: (modelName) => {
                return {
                  create: (recordToSave) => Promise.resolve(newRecordcors.find(record =>
                    record.street === recordToSave.street &&
                    record.postalCode === recordToSave.postalCode)),
                  findOne: (option) => Promise.resolve(newRecordcors.find(record => record._id === option._id)),
                  updateOne: () => Promise.resolve(recordUpdated),
                  delete: (_id) => Promise.resolve({n: 1, ok: 1, deletedCount: 1})
                };
              }
            };
          }
        });
      });
    });

    it('validate connection to db', async() => {
      const newDb = new Db();
      const newConnection = await newDb.connect();
      expect(newConnection).not.to.be.an('undefined');
      expect(newConnection.connections).to.be.an('array');
      expect(newConnection).to.have.keys('connections', '_pluralize', 'models', 'modelSchemas', 'options', 'Schema', 'model', 'plugins');
    });

    it('should create new wefox db instance', async() => {
      this.newInstanseDb = await Db.init();
      expect(this.newInstanseDb).to.have.any.keys('customModels', 'register');
    });

    it('register and get a model', () => {
      this.newRegisterModel = this.newInstanseDb.register('address', addressModel);
      this.myModel = this.newRegisterModel.get('address');

      expect(this.newRegisterModel).not.to.be.an('undefined');
      expect(this.myModel).not.to.be.an('undefined');
    });

    it('new address has to be inserted', async() => {
      const address = {
        street: 'Fellow court',
        streetNumber: 4,
        town: 'Hackney',
        postalCode: 'E2 8JL',
        country: 'UK'
      };
      const newAdreess = await this.myModel.create(address);

      expect(typeof newAdreess).to.be.equal('object');
      expect(newAdreess._id).to.be.equal(this._idExpected);
    });

    it('should find element already created', async() => {
      const element = await this.myModel.findOne({_id: this._idExpected});
      expect(element.street).to.be.equals('Fellow court');
      expect(element).to.have.any.keys('_id', '__v');
    });

    it('should update element', async() => {
      const options = {streetNumber: '7', town: 'Hackney Park'};
      const elementUpdate = await this.myModel.updateOne(this._idExpected, options);
      expect(elementUpdate.streetNumber).to.be.equal(options.streetNumber);
      expect(elementUpdate.town).to.be.equal(options.town);
    });

    it('should delete element', async() => {
      const deleteUpdate = await this.myModel.delete(this._idExpected);
      expect(deleteUpdate).to.have.keys('n', 'ok', 'deletedCount');
      expect(deleteUpdate.n).to.be.equal(1);
      expect(deleteUpdate.ok).to.be.equal(1);
      expect(deleteUpdate.deletedCount).to.be.equal(1);
    });
  });
});
