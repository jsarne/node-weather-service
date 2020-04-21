const request = require('request');

const forecast = (latitude, longitude, callback) => {
  const weatherstackUrl = `http://api.weatherstack.com/forecast?access_key=${process.env.WEATHERCAST_API_KEY}&units=f&query=${latitude},${longitude}`;

  request({url: weatherstackUrl, json: true}, (err, {statusCode, statusMessage, body}) => {
    if (err) {
      callback({code: -1, message: 'Unable to reach weather service'}, undefined);
    } else if (statusCode != 200) {
      callback({code: statusCode, message: statusMessage}, undefined);
    } else if (body.error) {  // not sure how to trigger this?
      callback({code: -2, message: body.error});
    } else {
      const temp = body.current.temperature;
      const desc = `${body.current.weather_descriptions.join(' and ')} and `;
      const wind = `Wind is ${body.current.wind_dir} at ${body.current.wind_speed}mph.`;
      const forecastMsg = `Per WeatherCast, it is currently ${desc} ${temp} degrees Farenheit. ${wind}`;
      callback(undefined, {forecastMsg});
    }
  });
};

module.exports = forecast;