const request = require('request');

const forecast = (latitude, longitude, callback) => {
  const darkSkyUrl = `https://api.darksky.net/forecast/${process.env.DARKSKY_API_KEY}/${latitude},${longitude}`;

  request({url: darkSkyUrl, json: true}, (err, {statusCode, statusMessage, body}) => {
    if (err) {
      callback({code: -1, message: 'Unable to reach darksky weather service'}, undefined);
    } else if (statusCode != 200) {
      callback({code: statusCode, message: statusMessage}, undefined);
    } else if (body.error) {  // not sure how to trigger this?
      callback({code: -2, message: body.error});
    } else {
      const temp = body.currently.temperature;
      const precipProb = body.daily.data[0].precipProbability;
      const forecast = body.daily.data[0].summary;
      const forecastMsg = `Today's forecast is ${forecast.toLowerCase()} Probability of precipitation today is ${precipProb*100}%. Currently it is ${temp} degrees.`;
      callback(undefined, {forecastMsg});
    }
  });
};

module.exports = forecast;