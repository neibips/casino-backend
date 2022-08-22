var express = require('express');
var router = express.Router();
const User = require('../Models/userSchema')

/* GET users listing. */
router.get('/flifp', async function(req, res, next) {


  res.send('respond with a resource');
});

module.exports = router;
