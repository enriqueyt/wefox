const expect = require('chai').expect;
const assert = require('chai').assert;
const request = require('supertest');
const {Address} = require('../../../application/address');
const {server} = require('../server-setup');

const authenticatedUser = request.agent(server);

describe('Handler CRUD for address db modelapplication db', () => {
  before('global stub', () => {
    const weatherStub = {
      coord: {
        lon: -0.13,
        lat: 51.51
      },
      weather: [
        {
          id: 803,
          main: 'Clouds',
          description: 'broken clouds',
          icon: '04d'
        }
      ],
      base: 'stations',
      main: {
        temp: 285.45,
        feels_like: 281.93,
        temp_min: 284.15,
        temp_max: 286.48,
        pressure: 1011,
        humidity: 71
      },
      visibility: 10000,
      wind: {
        speed: 4.1,
        deg: 240
      },
      clouds: {
        all: 75
      },
      dt: 1583926891,
      sys: {
        type: 1,
        id: 1414,
        country: 'GB',
        sunrise: 1583907779,
        sunset: 1583949486
      },
      timezone: 0,
      id: 2643743,
      name: 'London',
      cod: 200
    };
    console.log(weatherStub);
  });

  after(() => {

  });

  describe.skip('process to user the library in the application', () => {
    before('instanciate db application', async() => {

    });

    after(() => {
      this.initStub.restore();
    });

    it.skip('new address has to be inserted', async() => {
      const aux = {
        addressComponents: [
          {
            long_name: 'Fellows Court',
            short_name: 'Fellows Ct',
            types: [
              'route'
            ]
          },
          {
            long_name: 'London',
            short_name: 'London',
            types: [
              'postal_town'
            ]
          },
          {
            long_name: 'Greater London',
            short_name: 'Greater London',
            types: [
              'administrative_area_level_2',
              'political'
            ]
          },
          {
            long_name: 'England',
            short_name: 'England',
            types: [
              'administrative_area_level_1',
              'political'
            ]
          },
          {
            long_name: 'United Kingdom',
            short_name: 'GB',
            types: [
              'country',
              'political'
            ]
          },
          {
            long_name: 'E2',
            short_name: 'E2',
            types: [
              'postal_code',
              'postal_code_prefix'
            ]
          }
        ],
        geometry: [
          {
            bounds: {
              northeast: {
                lat: 51.5317622,
                lng: -0.0735943
              },
              southwest: {
                lat: 51.5305703,
                lng: -0.0748813
              }
            },
            location: {
              lat: 51.5314304,
              lng: -0.0742366
            },
            location_type: 'GEOMETRIC_CENTER',
            viewport: {
              northeast: {
                lat: 51.5325152302915,
                lng: -0.07288881970849798
              },
              southwest: {
                lat: 51.5298172697085,
                lng: -0.07558678029150204
              }
            }
          }
        ],
        _id: '5e68d6ba1bfa9f2fde0c38e4',
        street: 'Fellows Ct',
        formattedAddress: 'Fellows Ct, London E2, UK',
        streetNumber: '',
        town: 'London',
        postalCode: 'E2',
        country: ' UK',
        placeId: 'ChIJ9y41Ib8cdkgR1TX1odBwHMk',
        expire: 1583972218,
        __v: 0,
        weather: {
          coord: {
            lon: -0.13,
            lat: 51.51
          },
          weather: [
            {
              id: 803,
              main: 'Clouds',
              description: 'broken clouds',
              icon: '04d'
            }
          ],
          base: 'stations',
          main: {
            temp: 286.16,
            feels_like: 280.53,
            temp_min: 284.82,
            temp_max: 287.59,
            pressure: 1011,
            humidity: 62
          },
          visibility: 10000,
          wind: {
            speed: 6.7,
            deg: 230
          },
          clouds: {
            all: 75
          },
          dt: 1583928610,
          sys: {
            type: 1,
            id: 1414,
            country: 'GB',
            sunrise: 1583907779,
            sunset: 1583949486
          },
          timezone: 0,
          id: 2643743,
          name: 'London',
          cod: 200
        }
      };
      console.log(aux);
      const req = {
        body: {
          address: 'Fellows Ct',
          country: 'uk',
          town: 'london',
          postalCode: 'E2',
          streetNumber: 'Fellows'
        }
      };
      const newAdreess = await Address.validateAddressWeather(req);

      expect(typeof newAdreess).to.be.equal('object');
      expect(newAdreess._id).to.be.equal(this._idExpected);
    });
  });

  describe('/api/address/validate', () => {
    const req = {
      address: 'Fellows Ct',
      country: 'uk',
      town: 'london',
      postalCode: 'E2',
      streetNumber: 'Fellows'
    };

    it.skip('should validate and address given', () => {
      authenticatedUser
        .get('/api/address/validate')
        .query(req)
        .set({
          Authorization: 'Bearer 3f4aedb39a992484c058d334a7784de8fc1c9ff5'
        })
        .end((err, response) => {
          if (err) {
            assert.fail(err);
          }
          expect(response.statusCode).to.equal(200);
        });
    });

    it.skip('should retrieve infor for the weather', () => {
      authenticatedUser
        .get('/api/weather')
        .query(req)
        .set({
          Authorization: 'Bearer 3f4aedb39a992484c058d334a7784de8fc1c9ff5'
        })
        .end((err, response) => {
          if (err) {
            assert.fail(err);
          }
          expect(response.statusCode).to.equal(200);
        });
    });

    it.skip('should retrieve info the address and the weather', () => {
      authenticatedUser
        .get('/api/address')
        .query(req)
        .set({
          Authorization: 'Bearer 3f4aedb39a992484c058d334a7784de8fc1c9ff5'
        })
        .end((err, response) => {
          if (err) {
            assert.fail(err);
          }
          expect(response.statusCode).to.equal(200);
        });
    });
  });
});
