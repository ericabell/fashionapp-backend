const mongoose = require('mongoose');
ObjectId = require('mongodb').ObjectID;

mongoose.Promise = require('bluebird');

const citySchema = new mongoose.Schema({
  name: String
});

const City = mongoose.model('City', citySchema);

module.exports = City;
