const request = require('request');

const geocode = (address, callback) => {
  const encodedAddress = encodeURIComponent(address);
  const mapBoxUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?limit=1&access_token=${process.env.MAPBOX_API_KEY}`;
  request({url: mapBoxUrl, json: true}, (err, {statusCode, statusMessage, body}) => {
    if (err) {
      callback({code: -1, message: 'Unable to reach mapbox geocode service'}, undefined);
    } else if (statusCode != 200) {
      callback({code: statusCode, message: statusMessage}, undefined);
    } else if (body.features.length == 0) {
      callback({code: -1, message: `Invalid location ${body.query}`}, undefined);
    } else {
      const place_name = body.features[0].place_name;
      const latitude = body.features[0].center[1];
      const longitude = body.features[0].center[0];
      callback(undefined, {place_name, latitude, longitude});
    }
  });
};

module.exports = geocode;