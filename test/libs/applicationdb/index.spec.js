const expect = require('chai').expect;
const assert = require('assert');
const sinon = require('sinon');
const {Db} = require('../../../libs/applicationdb/index');
const {addressModel} = require('../../../application/address/addressModel');

describe('lib application db', () => {
  before('instanciate db application', () => {
    this.applicationDb = null;
    this.newInstance = null;
    this.dbSpy = sinon.stub(Db.prototype, 'connect').callsFake(async() => Promise.resolve(this.mockDbConnection));
    this.mockDbConnection = {
      connections: [],
      models: {},
      modelSchemas: {},
      options: {},
      Schema: {},
      model: [],
      plugins: []
    };
  });

  it('validate connection to db', async() => {
    const newDb = new Db();
    const newConnection = await newDb.connect();
    expect(newConnection).not.to.be.an('undefined');
    expect(newConnection.connections).to.be.an('array');
    expect(newConnection).to.have.keys('connections', 'models', 'modelSchemas', 'options', 'Schema', 'model', 'plugins');
  });

  it('should create new wefox db instance', async function() {
    this.applicationdb = await Db.init();
    if (this.applicationdb instanceof Db) {
      assert('well created an db instance');
    } else {
      assert.fail('model is not a instance of [Db]');
    }
  });

  it('should registre new model', function() {
    this.newInstance = this.applicationdb.register('address', addressModel);
    const myModel = this.newInstance.get('address');
    assert.strict.notEqual(myModel, undefined);
  });

  it('new address has to be inserted', function() {
    const myModel = this.newInstance.get('address');
    const address = {
      street: '',
      streetNumber: 4,
      town: '',
      postalCode: 4,
      country: ''
    };
    const newAdreess = myModel.create(address);
    assert.strict.equal(typeof newAdreess, 'object');
  });

  it('should update the model created', function() {
    const myModel = this.newInstance.get('address');
    console.log(myModel);
    assert.strict.equal(typeof myModel, 'object');
  });
});
