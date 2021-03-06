var express = require('express');
var router = express.Router();
const multer = require('multer');
const fs = require('fs');

var storage = multer.memoryStorage()
var upload = multer({ storage: storage })

const User = require('../models/users');
const owm = require('../controllers/openweathermap');

/* basic status. */
router.get('/status', function(req, res, next) {
  res.json({status: 'ok'});
});

/* authenticate a user/pass pair */
router.post('/login', function( req, res, next ) {
  // expect username/pass in body as json
  if(req.body.username && req.body.password) {
    // validate against users collection
    User.findOne({username: req.body.username})
      .then( (result) => {
        console.log(result);
        if( result.authenticate(req.body.password) ) {
          res.json({status: 'success'})
        } else {
          res.json({status: 'failure'})
        }
      })
  }
})

/* register a new user */
router.post('/register', function( req, res, next) {
  User.create({
    username: req.body.username,
    password: req.body.password
  })
    .then( (results) => {
      res.send('user created');
    })
    .catch( (err) => {
      res.send(err);
    })
})

/* get a list of all users */
router.get('/users', function( req, res, next) {
  User.find({})
    .then( (results) => {
      res.json({status: 'ok', users: results})
    })
})

/* get a single user profile */
router.get('/user/:id', function( req, res, next) {
  User.findById(req.params.id)
    .then( (result) => {
      res.json({status: 'ok', data: result})
    })
})

/* set property for userid profile */
router.post('/:id/profile', function( req, res, next) {
  User.findById(req.params.id)
    .then( (result) => {
      if(req.body.location) {
        result.location = req.body.location;
        result.save()
          .then( (result) => {
            res.json({status: 'ok', message: 'location added'})
          })
          .catch( (err) => {
            res.send(err);
          })
      }
    })
    .catch( (err) => {
      res.send(err);
    })
})

/* get weather for user */
router.get('/:id/weather', function( req, res, next) {
  User.findById(req.params.id)
    .then( (result) => {
      // get the user's location
      let location = result.location;
      // get the weather for that location
      owm.getWeatherForCity(location)
        .then( (result) => {
          res.json({status: 'ok', data: result.data})
        })
        .catch( (err) => {
          res.send(err);
        })
    })
})

/* send back the form to upload an image */
router.get('/clothing', function( req, res, next) {
  User.find({})
    .then( (results) => {
      console.log(results);
      res.render('upload', {
                title: 'Upload Clothing',
                users: results
               })
    })
})

/* add an image to the specified id */
router.post('/clothing', upload.single('sampleFile'), function( req, res, next) {
  if(!req.file) {
    return res.status(400).send('No files were selected');
  }

  console.log(req.body);

  User.findById(req.body.userid)
    .then( (user) => {
      user.images.push({data: req.file.buffer,
                        tags: req.body.tags,
                        contentType: req.file.mimetype});
      user.save()
        .then( (result) => {
          res.json({status: 'ok', message: 'image added'})
        })
        .catch( (err) => {
          res.send(err)
        })
    })
    .catch( (err) => {
      res.send(err)
    })
})
module.exports = router;
