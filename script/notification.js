const db = require('../application/db');
const api = require('../application/api');
const moment = require('moment');
const {sendEmail} = require('../libs/utils/sendEmail');

const mapQueryWeather = (body) => {
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
};

const notificationProcess = async(req, res) => {
  const dbInstanse = await db();
  const addressModel = dbInstanse.get('address');
  const weatherModel = api.get('weather');
  const address = await addressModel.findPopulate({notification: true}, 'user');
  let response = null;
  while (address.length) {
    const currenAddress = address.pop();
    const weather = await weatherModel.request({q: mapQueryWeather(currenAddress)});
    if (weather) {
      const {data} = weather;
      for (const i in data.weather) {
        const date = moment().format('hh');
        if (data.weather[i].main === 'Rain' && (date > 6 && date < 11)) {
          response = await sendEmail({
            to: currenAddress.user.email,
            subject: `Weather - ${data.weather[i].main}`,
            text: `It's going to ${data.weather[i].main}`
          });
        }
      }
    }
  }
  res.json(response);
};

module.exports = notificationProcess;
