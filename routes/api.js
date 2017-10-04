var express = require('express');
var router = express.Router();

const User = require('../models/users');

/* basic status. */
router.get('/status', function(req, res, next) {
  res.json({status: 'ok'});
});

/* authenticate a user/pass pair */
router.post('/login', function( req, res, status ) {
  // expect username/pass in body as json
  if(req.body.username && req.body.password) {
    // validate against users collection
    User.find({username: req.body.username})
      .then( (result) => {
        if( result.authenticate(req.body.password) ) {
          res.json({status: 'success'})
        } else {
          res.json({status: 'failure'})
        }
      })
  }
})

/* register a new user */
router.post('/register', function( req, res, status) {
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

module.exports = router;
