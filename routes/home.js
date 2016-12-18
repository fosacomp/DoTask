var express = require('express');
var router = express.Router();
var db = require('../libs/db/mysql');
//var auth = require('middleware/auth');

/* GET home page. */
router.get('/', function(req, res) {
  //checkAuth
  //req.user = res.locals.user = 'p';
  if(req.session.userid)
    if(req.session.role == 1)
      res.render('homec');
    else
      res.render('homep');
});

module.exports = router;
