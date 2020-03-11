const moment = require('moment');
const api = require('../api');
const db = require('../db');

const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const findAddressInDB = async({address, town, postalCode, country}) => {
  const dbInstanse = await db();
  const addressModel = dbInstanse.get('address');
  return addressModel.findOne({
    street: capitalize(address),
    town: capitalize(town),
    postalCode: postalCode,
    country: country.toUpperCase()
  });
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
    return this.retrieveTheWeather(req);
  }

  mapGeocodingObject(geocodingData, user = '') {
    const expire = moment().utc().add({hours: 12}).unix();
    const [street, _town, country] = geocodingData.formatted_address.split(',');
    const [town, postalCode] = _town.trim().split(' ');
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
      user: user
    };
  }

  itHasExpired({expire}) {
    return expire < moment().utc().unix();
  }

  async retriveInfoRelatedAddress(req) {
    const currentAddress = await this.getAddress(req);
    if (this.validateAddress(currentAddress)) {
      const responseData = currentAddress.data.results.shift();
      const documentCreated = await saveAddressToDB(this.mapGeocodingObject(responseData, req.user.accessToken));
      const weather = await this.weatherModel.request({q: this.mapQueryWeather(documentCreated)});
      return Object.assign({}, documentCreated._doc, {weather: weather.data});
    } else {
      throw new Error('Invalid address');
    }
  }

  async retrieveTheWeather(data) {
    return this.weatherModel.request({q: this.mapQueryWeather(data)});
  }

  async validateAddressWeather(req) {
    const result = await findAddressInDB(req.body);
    if (result) {
      if (!this.itHasExpired(result)) {
        const weather = await this.retrieveTheWeather(result);
        return Object.assign({}, result, {weather: weather.data});
      } else {
        await deleteAddressToDB(result._id);
        return this.retriveInfoRelatedAddress(req);
      }
    } else {
      return this.retriveInfoRelatedAddress(req);
    }
  }

  rowToVolunteer(row) {
    return {
      address: row.address,
      postal_code: row.postalCode,
      country: row.country,
      postal_town: row.town,
      route: row.streetNumber
    };
  }

  async getAddress(req) {
    const data = this.mapQueryComponents(this.rowToVolunteer(req.body));
    return this.goecodingModel.request(data);
  }

  isValidAddress({status, statusText, data}) {
    return status === 200 && statusText === 'OK' && data.status !== 'OK';
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
}

module.exports.Address = Address.init();
