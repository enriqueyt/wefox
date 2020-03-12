const expect = require('chai').expect;
const {User} = require('../../../application/user');

describe.skip('CRUD for User Model in database', () => {
  before('global stub', () => {
    this.newInstanseDb = null;
  });

  after(() => {

  });

  describe('process to user the library in to the application', () => {
    before('instanciate db application', async() => {
      this._idExpected = '5e680c0934355215a2f1b98e';
    });

    after(() => {
      this.initStub.restore();
    });

    it.only('create new user has to be inserted', async() => {
      const myUser = await User.init();
      const user = {
        name: 'Enrique yepez three',
        username: 'enriqueyt3',
        password: 'password123',
        email: 'enrique@gmail.com',
        postalCode: 'E2 8JL',
        country: 'UK',
        notification: true
      };

      const newUser = await myUser.createUser(user);

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
