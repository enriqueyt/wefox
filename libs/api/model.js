const axios = require('axios');

class ModelApi {
  constructor(model) {
    this.Model = model;
  }

  async request(document, method = 'get') {
    const url = this.Model.url;
    const params = Object.assign({}, document, this.Model.options);
    return axios({params, method, url});
  }
}

module.exports = ModelApi;
