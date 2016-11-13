var express = require('express');
var router = express.Router();
var db = require('../libs/db/mysql');
var homecSQL = require("../sql/homec");

/* GET home page. */
router.get('/', function(req, res, next) {


  res.render('homec');

});

module.exports = router;
