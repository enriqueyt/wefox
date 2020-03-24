const moment = require('moment');
const api = require('../api');
const db = require('../db');

const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const clearQueryObject = ({address, town, postalCode, country}) => {
  const obj = {};
  const ROW = {
    STREET: 'street',
    TOWN: 'street',
    POSTAL_CODE: 'street',
    COUNTRY: 'street'
  };
  if (address) {
    obj[ROW.STREET] = capitalize(address);
  }
  if (town) {
    obj[ROW.TOWN] = capitalize(town);
  }
  if (postalCode) {
    obj[ROW.POSTAL_CODE] = postalCode;
  }
  if (country) {
    obj[ROW.COUNTRY] = capitalize(country);
  }
  return obj;
};

const findAddressInDB = async(paramObj) => {
  const dbInstanse = await db();
  const addressModel = dbInstanse.get('address');
  return addressModel.find(clearQueryObject(paramObj));
};

const saveAddressToDB = async(document) => {
  const dbInstanse = await db();
  const addressModel = dbInstanse.get('address');
  return addressModel.create(document);
};

const deleteAddressToDB = async(id) => {
  const dbInstanse = await db();
  const addressModel = dbInstanse.get('address');
  return addressModel.delete(id);
};

class Address {
  constructor() {
    this.goecodingModel = api.get('goecoding');
    this.weatherModel = api.get('weather');
  }

  static init() {
    return new Address();
  }

  async validate(req) {
    return this.validateAddress(req);
  }

  async validateAddress(req) {
    const currentAddress = await this.getAddress(req);
    return this.isValidAddress(currentAddress);
  }

  async validateWeather(req) {
    return this.retrieveTheWeather(this.parseQueryRequest(req));
  }

  mapGeocodingObject(geocodingData, user = '') {
    const expire = moment().utc().add({hours: 12}).unix();
    const [street, town, postalCode, country] = geocodingData.formatted_address.split(',');
    return {
      street: street,
      formattedAddress: geocodingData.formatted_address,
      addressComponents: geocodingData.address_components,
      streetNumber: street,
      town: town.trim(),
      postalCode: postalCode.trim(),
      country: country.trim(),
      geometry: geocodingData.geometry,
      placeId: geocodingData.place_id,
      expire: expire,
      userToken: user.accessToken,
      user: user.id,
      notification: user.notification
    };
  }

  itHasExpired({expire}) {
    return expire < moment().utc().unix();
  }

  async retriveInfoRelatedAddress(req) {
    const currentAddress = await this.getAddress(req);
    if (this.isValidAddress(currentAddress)) {
      const result = await this.processDataFromGoecoding(currentAddress.data.results, req.user);
      return result;
    } else {
      throw new Error(currentAddress.data.status);
    }
  }

  async processDataFromGoecoding(arrAddress, user) {
    const result = [];
    let weather;
    for (let i = 0; i < arrAddress.length; i++) {
      const documentCreated = await saveAddressToDB(this.mapGeocodingObject(arrAddress[i], user));
      try {
        weather = await this.weatherModel.request({q: this.mapQueryWeather(documentCreated)});
      } catch (e) {
        weather.data = new Error(e);
      }
      result.push(Object.assign({}, documentCreated._doc, {weather: weather.data}));
    }
    return result;
  }

  async retrieveTheWeather(data) {
    return this.weatherModel.request({q: this.mapQueryWeather(data)});
  }

  async validateAddressWeather(req) {
    const result = await findAddressInDB(this.parseQueryRequest(req));
    if (result) {
      return this.arrangementDataFromDB(result, req);
    } else {
      return this.retriveInfoRelatedAddress(req);
    }
  }

  async arrangementDataFromDB(arrData, req) {
    const result = [];
    let weather;
    for (let i = 0; i < arrData.length; i++) {
      if (!this.itHasExpired(arrData[i])) {
        try {
          weather = await this.retrieveTheWeather(arrData[i]);
        } catch (e) {
          weather.data = new Error(e);
        }
        result.push(Object.assign({}, result, {weather: weather.data}));
      } else {
        await deleteAddressToDB(result._id);
        result.push(this.retriveInfoRelatedAddress(arrData[i], req));
      }
    }

    return result;
  }

  rowToVolunteer(row) {
    const map = {};
    const ROW = {
      address: 'address',
      postalCode: 'postal_code',
      country: 'country',
      town: 'postal_town',
      route: 'streetNumber'
    };

    for (const i in row) {
      if (row[i]) {
        map[ROW[i]] = row[i];
      }
    }

    return map;
  }

  async getAddress(req) {
    const data = this.mapQueryComponents(this.rowToVolunteer(this.parseQueryRequest(req)));
    return this.goecodingModel.request(data);
  }

  isValidAddress({status, statusText, data}) {
    return status === 200 && statusText === 'OK' && data.status === 'OK';
  }

  mapQueryWeather(body) {
    let options = '';
    let i = 0;
    let identifier = '';
    for (const key in body) {
      identifier = i > 0 ? ',' : '';
      if (key === 'town' || key === 'postalCode' || key === 'country') {
        options += `${identifier}${body[key]}`;
        i += 1;
      }
    }
    return options;
  }

  mapQueryComponents(body) {
    let options = '';
    let i = 0;
    let identifier = '';
    for (const key in body) {
      identifier = i > 1 ? '|' : '';
      if (key && key !== 'address') options += `${identifier}${key}:${body[key]}`;
      i += 1;
    }
    return {
      address: body.address,
      components: options
    };
  }

  parseQueryRequest(req) {
    return Object.assign({}, {
      address: req.query.address,
      country: req.query.country,
      town: req.query.town,
      postalCode: req.query.postalCode,
      streetNumber: req.query.streetNumber
    });
  }
}

module.exports.Address = Address.init();
