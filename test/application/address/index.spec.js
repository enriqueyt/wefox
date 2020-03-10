const expect = require('chai').expect;
const sinon = require('sinon');
const {Db} = require('../../../libs/applicationdb/index');
const {addressModel} = require('../../../application/address/addressModel');

describe('Handler CRUD for address db modelapplication db', () => {
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

  describe('process to user the library in the application', () => {
    before('instanciate db application', async() => {
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
      this.initStub = sinon.stub(Db, 'init').callsFake(async() => {
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

      this.newInstanseDb = await Db.init();
      this.newRegisterModel = this.newInstanseDb.register('address', addressModel);
      this.myModel = this.newRegisterModel.get('address');
    });

    after(() => {
      this.initStub.restore();
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
