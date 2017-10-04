const axios = require('axios');
const Weather = require('../models/weather');
const City = require('../models/cities');

const API_KEY = process.env.OPENWEATHERMAPAPI;

function getWeatherForCity(cityName) {
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&APPID=` + API_KEY;

  p1 = new Promise( (resolve, reject) => {
    axios.get(url)
      .then( (data) => {
        resolve(data);
      })
      .catch( (err) => {
        reject(err);
      })
  })

  return p1;
}

function saveWeatherDataForCityList() {
  // grab the city list from the db
  City.find({})
    .then( (results) => {
      console.log('city list');
      console.log(results);
      results.forEach( (city) => {
        saveWeatherData(city.name);
      })
    })
}

function saveWeatherData(cityName) {
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&APPID=` + API_KEY;

  axios.get(url)
    .then( (data) => {
      Weather.create({
        coord: data.data.coord,
        weather: data.data.weather,
        main: data.data.main,
        wind: data.data.wind,
        clouds: data.data.clouds,
        rain: data.data.rain,
        snow: data.data.snow,
        dt: new Date(data.data.dt*1000),  // UTC unix from OWM API...
        id: data.data.id,
        name: data.data.name
      })
      .then( (result) => {
        console.log('Weather data saved to db.');
      })
    })
    .catch( (err) => {
      console.log(err);
    })
}

function searchForWeatherTerms(terms) {
  // terms is a list
  console.log('Searching for:');
  console.log(terms.join(' '));
  return Weather.find(
    { $text: { $search : terms.join(' ') }},
    { score: { $meta : "textScore" }}
  )
  .sort( { score: { $meta: 'textScore' }})
}

function searchForTemperature(temp) {
  console.log('Searching for:');
  console.log(temp);
  return Weather.find()
    .where('main.temp').lt(temp+10).gt(temp-10)
}

module.exports = {
  getWeatherForCity: getWeatherForCity,
  saveWeatherData: saveWeatherData,
  saveWeatherDataForCityList: saveWeatherDataForCityList,
  searchForWeatherTerms: searchForWeatherTerms,
  searchForTemperature: searchForTemperature
}
