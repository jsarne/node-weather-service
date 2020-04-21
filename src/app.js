const path = require('path');
const express = require('express');
const hbs = require('hbs');
const forecast = require(path.join(__dirname, 'utils', 'forecast'));
const geocode = require(path.join(__dirname, 'utils', 'geocode'));

const publicPath = path.join(__dirname, '..', 'public');
const viewsPath = path.join(__dirname, '..', 'templates', 'views');
const partialsPath = path.join(__dirname, '..', 'templates', 'partials');

const app = express();
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);
app.use(express.static(publicPath));

const boilerplate = {title: 'Weather from App.js', footerText: 'Created by oolong'};

app.get('', (req, res) => {
  res.render('index', boilerplate);
});

app.get('/about', (req, res) => {
  res.render('about', boilerplate);
});

app.get('/help', (req, res) => {
  res.render('help', {...boilerplate, title: 'Help', helpMessage: 'Help Me!'});
});

app.get('/help/*', (req, res) => {
  res.render('notfound', {...boilerplate, title: 'Not Found', notFoundMessage: 'Help article not found.'});
});

app.get('/weather', (req, res) => {
  if (!req.query.address) {
    return res.send({error: 'Address is required'});
  }
  geocode(req.query.address, (error, {place_name:loc, latitude:lat, longitude:long} = {}) => {
    if (error) {
      return res.send({error: `(${error.code}) ${error.message}`});
    }
    forecast(lat, long, (error, {forecastMsg:msg}) => {
      if (error) {
        return res.send({error: `(${error.code}) ${error.message}`});
      }
      return res.send({
        forecast: msg,
        location: loc,
        lat: `${lat} (${lat >= 0 ? 'North' : 'South'})`,
        long: `${long} (${long >= 0 ? 'East' : 'West'})`
      });  
    });  
  });
});

app.get('*', (req, res) => {
  res.render('notfound', {...boilerplate, title: 'Not Found', notFoundMessage: 'Page not found.'});
});

const port = 3000;
app.listen(port, () => {
  console.log(`Express server is up on port ${port}`);
});