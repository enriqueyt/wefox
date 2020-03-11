const expect = require('chai').expect;
const assert = require('assert');
const sinon = require('sinon');
const {Api} = require('../../../libs/api');

const {geocodingAPI, geocodingUrl, weatherURL, weatherAPI} = require('../../../config');
const weather = {url: weatherURL, options: {appid: weatherAPI}};
const goecoding = {url: geocodingUrl, options: {key: geocodingAPI}};

describe('lib authentication db (redis)', () => {
  it('should create new Api instance', async() => {
    const apiInstanase = Api.init();
    if (apiInstanase instanceof Api) {
      assert('this.apiInstanase is an insatnce of Api class');
    } else {
      assert.fail('this.apiInstanase is not an insatnce of Api class');
    }
  });

  describe('validate Geocoding Api', () => {
    before('global stub', () => {
      this.responseMock = {
        status: 200,
        statusText: 'OK',
        data: {
          results: [
            {
              address_components: [
                {
                  long_name: '221',
                  short_name: '221',
                  types: [
                    'street_number'
                  ]
                },
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
              formatted_address: '221 Fellows Ct, London E2, UK',
              geometry: {
                location: {
                  lat: 51.53161679999999,
                  lng: -0.073715
                },
                location_type: 'RANGE_INTERPOLATED',
                viewport: {
                  northeast: {
                    lat: 51.53296578029149,
                    lng: -0.07236601970849797
                  },
                  southwest: {
                    lat: 51.53026781970849,
                    lng: -0.07506398029150203
                  }
                }
              },
              place_id: 'EhoyMjEgRmVsbG93cyBDdCwgTG9uZG9uLCBVSyIbEhkKFAoSCeGandm-HHZIEcshIjuSSnuXEN0B',
              types: [
                'street_address'
              ]
            }
          ],
          status: 'OK'
        },
        config: {},
        headers: {},
        request: {}
      };
      this.geocodingStub = sinon.stub(Api, 'init').callsFake(() => {
        return {
          register: (name, model) => {
            return {
              customModels: {
                goecoding: {
                  url: 'hht', options: {}
                }
              }
            };
          },
          get: (modelName) => {
            return {
              Model: {
                url: 'https://maps.googleapis.com/maps/api/geocode/json',
                options: ''
              },
              request: async() => Promise.resolve(this.responseMock)
            };
          }
        };
      });
      this.apiInstanase = Api.init();
    });

    after(() => {
      this.geocodingStub.restore();
    });

    it('should register Geocoding model', () => {
      this.newRegisterModel = this.apiInstanase.register('goecoding', goecoding);
      expect(this.newRegisterModel).to.have.any.keys('customModels');
      expect(this.newRegisterModel.customModels).to.have.keys('goecoding');
      expect(this.newRegisterModel.customModels.goecoding).to.have.keys('url', 'options');
    });

    it('should get Geocoding model', () => {
      this.newRegisterModel = this.apiInstanase.get('goecoding');
      expect(this.newRegisterModel).to.have.any.keys('Model');
      expect(this.newRegisterModel.Model).to.have.keys('url', 'options');
      expect(this.newRegisterModel.Model.url).to.be.equal('https://maps.googleapis.com/maps/api/geocode/json');
    });

    it('should make request to Geocoding asking with address and country', async() => {
      const response = await this.newRegisterModel.request({
        address: '221 Fellows Ct',
        components: {
          country: 'uk'
        }
      });
      expect(response).to.have.keys('status', 'statusText', 'data', 'config', 'headers', 'request');
      expect(response.status).to.be.equal(200);
      expect(response.statusText).to.be.equal('OK');
      expect(response.data).to.be.an('object');
      expect(response.data.results).to.be.an('array');
      expect(response.data.status).to.be.equal('OK');
    });
  });

  describe('validate Open Weather Map Api', () => {
    before('global stub', () => {
      this.data = {
        coord: {
          lon: -0.13,
          lat: 51.51
        },
        weather: [
          {
            id: 501,
            main: 'Rain',
            description: 'moderate rain',
            icon: '10n'
          }
        ],
        base: 'stations',
        main: {
          temp: 281.36,
          feels_like: 275.44,
          temp_min: 280.15,
          temp_max: 282.59,
          pressure: 1007,
          humidity: 87
        },
        visibility: 8000,
        wind: {
          speed: 7.2,
          deg: 220,
          gust: 13.4
        },
        rain: {
          '1h': 1.27
        },
        clouds: {
          all: 90
        },
        dt: 1583788533,
        sys: {
          type: 1,
          id: 1414,
          country: 'GB',
          sunrise: 1583735250,
          sunset: 1583776480
        },
        timezone: 0,
        id: 2643743,
        name: 'London',
        cod: 200
      };
      this.responseMock = {
        status: 200,
        statusText: 'OK',
        data: this.data,
        config: {},
        headers: {},
        request: {}
      };
      this.weatherStub = sinon.stub(Api, 'init').callsFake(() => {
        return {
          register: (name, model) => {
            return {
              customModels: {
                weather: {
                  url: '', options: {}
                }
              }
            };
          },
          get: (modelName) => {
            return {
              Model: {
                url: 'http://api.openweathermap.org/data/2.5/weather',
                options: ''
              },
              request: async() => Promise.resolve(this.responseMock)
            };
          }
        };
      });

      this.apiInstanase = Api.init();
    });

    after(() => {
      this.weatherStub.restore();
    });

    it('should register Openweather model', () => {
      this.newRegisterModel = this.apiInstanase.register('weather', weather);
      expect(this.newRegisterModel).to.have.any.keys('customModels');
      expect(this.newRegisterModel.customModels).to.have.keys('weather');
      expect(this.newRegisterModel.customModels.weather).to.have.keys('url', 'options');
    });

    it('should get Geocoding model', () => {
      this.newRegisterModel = this.apiInstanase.get('weather');
      expect(this.newRegisterModel).to.have.any.keys('Model');
      expect(this.newRegisterModel.Model).to.have.keys('url', 'options');
      expect(this.newRegisterModel.Model.url).to.be.equal('http://api.openweathermap.org/data/2.5/weather');
    });

    it('should make request to Geocoding asking with address and country', async() => {
      const response = await this.newRegisterModel.request({
        q: 'london'
      });
      expect(response).to.have.keys('status', 'statusText', 'data', 'config', 'headers', 'request');
      expect(response.status).to.be.equal(200);
      expect(response.statusText).to.be.equal('OK');
      expect(response.data).to.be.an('object');

      expect(response.data.coord).to.deep.equal({lon: -0.13, lat: 51.51});

      expect(response.data.weather[0].id).to.be.equal(501);
      expect(response.data.weather[0].main).to.be.equal('Rain');
      expect(response.data.weather[0].description).to.be.equal('moderate rain');
      expect(response.data.weather[0].icon).to.be.equal('10n');

      expect(response.data.name).to.be.equal('London');
    });
  });
});
