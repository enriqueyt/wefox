const expect = require('chai').expect;
const sinon = require('sinon');
const {Db} = require('../../../libs/applicationdb/index');
const {userModel} = require('../../../application/user/userModal');

describe('CRUD for User Model in database', () => {
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

  describe('process to user the library in to the application', () => {
    before('instanciate db application', async() => {
      this._idExpected = '5e680c0934355215a2f1b98e';
      const newRecordcors = [{
        _id: '5e680c0934355215a2f1b98e',
        name: 'Enrique yepez two',
        username: 'enriqueyt1',
        password: 'password11',
        email: 'enrique@gmail.com',
        postalCode: 'E2 8JL',
        country: 'UK',
        __v: 0
      }];
      const recordUpdated = {
        _id: '5e680c0934355215a2f1b98e',
        name: 'Enrique Yepez',
        __v: 0
      };
      this.initStub = sinon.stub(Db, 'init').callsFake(async() => {
        return Promise.resolve({
          register: (name, model) => {
            return {
              get: (modelName) => {
                return {
                  create: (recordToSave) => Promise.resolve(newRecordcors.find(record =>
                    record.username === recordToSave.username && record.password === recordToSave.password)),
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
      this.newRegisterModel = this.newInstanseDb.register('user', userModel);
      this.myModel = this.newRegisterModel.get('user');
    });

    after(() => {
      this.initStub.restore();
    });

    it('create new user has to be inserted', async() => {
      const user = {
        name: 'Enrique yepez two',
        username: 'enriqueyt1',
        password: 'password11',
        email: 'enrique@gmail.com',
        postalCode: 'E2 8JL',
        country: 'UK'
      };
      const newUser = await this.myModel.create(user);
      expect(typeof newUser).to.be.equal('object');
      expect(newUser).to.have.any.keys('_id', '__v');
      expect(newUser._id).to.be.equal(this._idExpected);
    });

    it('should find user element already created', async() => {
      const element = await this.myModel.findOne({_id: this._idExpected});
      expect(element.name).to.be.equals('Enrique yepez two');
      expect(element.username).to.be.equal('enriqueyt1');
      expect(element).to.have.any.keys('_id', '__v');
    });

    it('should update element', async() => {
      const options = {name: 'Enrique Yepez'};
      const elementUpdate = await this.myModel.updateOne(this._idExpected, options);
      expect(elementUpdate.name).to.be.equal(options.name);
    });

    it('should delete user element', async() => {
      const deleteUpdate = await this.myModel.delete(this._idExpected);
      expect(deleteUpdate).to.have.keys('n', 'ok', 'deletedCount');
      expect(deleteUpdate.n).to.be.equal(1);
      expect(deleteUpdate.ok).to.be.equal(1);
      expect(deleteUpdate.deletedCount).to.be.equal(1);
    });
  });
});
