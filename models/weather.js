const mongoose = require('mongoose');
ObjectId = require('mongodb').ObjectID;

mongoose.Promise = require('bluebird');

const weatherSchema = new mongoose.Schema({
  coord: {
    lon: String,
    lat: String
  },
  weather: [],
  main: {
    temp: Number,
    pressure: Number,
    humidity: Number,
    temp_min: Number,
    temp_max: Number,
    sea_level: String,
    grnd_level: String
  },
  wind: {
    speed: String,
    deg: String
  },
  clouds: {
    all: String
  },
  rain: {
    '3h': String
  },
  snow: {
    '3h': String
  },
  dt: Date,
  id: String,
  name: String
});

weatherSchema.index({weather: 'text'});

const Weather = mongoose.model('Weather', weatherSchema);

module.exports = Weather;
