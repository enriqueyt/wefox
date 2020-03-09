const expect = require('chai').expect;
const sinon = require('sinon');
const {Redis} = require('../../../libs/authentiactiondb');

describe('lib authentication db (redis)', () => {
  before('global stub', () => {
    sinon.stub(Redis, 'init').callsFake(async() => {
      return Promise.resolve({
        Model: {
          _events: [],
          _eventsCount: {},
          address: '',
          connection_options: {},
          connection_id: 1,
          connected: true,
          ready: [],
          should_buffer: '',
          connect_timeout: 1000
        },
        set: async() => Promise.resolve(true),
        get: async(key) => Promise.resolve('newSession'),
        destroy: async(key) => Promise.resolve(true)
      });
    });
  });

  describe('functionalities basic of the redis library', () => {
    it('should create new redis-model db instance', async() => {
      this.newRedisInstanase = await Redis.init();
      expect(this.newRedisInstanase).to.have.any.keys('Model');
      expect(this.newRedisInstanase.Model).to.have.any.keys('_events', '_eventsCount', 'address', 'connection_options',
        'connection_id', 'connected', 'ready', 'should_buffer', 'connect_timeout');
    });

    it('should register new value in redis', async() => {
      const setNewValue = await this.newRedisInstanase.set('value', 'newSession');
      expect(setNewValue).to.be.equal(true);
    });

    it('should get the value registered', async() => {
      const getNewValue = await this.newRedisInstanase.get('value');
      expect(getNewValue).to.be.equal('newSession');
    });

    it('should delete the register by given an id', async() => {
      const deleteValue = await this.newRedisInstanase.destroy('value');
      expect(deleteValue).to.be.equal(true);
    });
  });
});
