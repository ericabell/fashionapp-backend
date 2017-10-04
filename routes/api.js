var express = require('express');
var router = express.Router();

/* basic status. */
router.get('/status', function(req, res, next) {
  res.json({status: 'ok'});
});

module.exports = router;
