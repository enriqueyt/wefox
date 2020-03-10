const expect = require('chai').expect;
const assert = require('assert');
const sinon = require('sinon');
const {Db} = require('../../../libs/applicationdb/index');
const {addressModel} = require('../../../application/address/addressModel');
const {userModel} = require('../../../application/user/userModal');

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
    this.connectStub = sinon.stub(Db.prototype, 'connect').callsFake(async() => Promise.resolve(mockDbConnection));
  });

  after(() => {
    this.connectStub.restore();
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

  describe('process to user the library in the applitcaion', () => {
    before('instanciate db application', () => {
      this.newRegisterModel = null;
      this.myModel = null;
      this.customModels = {};
      this._idExpected = '5e659c707c6929c2f95dc86a';
      this.initStub = sinon.stub(Db, 'init').callsFake(async() => {
        return Promise.resolve({
          register: (name, model) => {
            this.customModels[name] = model;
            return {
              get: (modelName) => {
                return this.customModels[modelName];
              }
            };
          }
        });
      });
    });

    after(() => {
      this.initStub.restore();
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

    it('register and get a address model', () => {
      const newRegisterModel = this.newInstanseDb.register('address', addressModel);
      const myModel = newRegisterModel.get('address');

      expect(newRegisterModel).not.to.be.an('undefined');
      expect(myModel).not.to.be.an('undefined');
    });

    it('register and get a User model', () => {
      const newRegisterUserModel = this.newInstanseDb.register('user', userModel);
      const myUserModel = newRegisterUserModel.get('user');

      expect(newRegisterUserModel).not.to.be.an('undefined');
      expect(myUserModel).not.to.be.an('undefined');
    });
  });
});
