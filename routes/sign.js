var express = require('express');
var router = express.Router();
var db = require('../libs/db/mysql');
var homecSQL = require("../sql/homec");

/* sign check. */
router.get('/', function(req, res, next) {
    var sess = req.session
    if (sess.views) {
        sess.views++
        res.setHeader('Content-Type', 'text/html')
        res.write('<p>views: ' + sess.views + '</p>')
        res.write('<p>expires in: ' + (sess.cookie.maxAge / 1000) + 's</p>')
        res.end()
    } else {
        sess.views = 1
        res.end('welcome to the session demo. refresh!')
    }
});

module.exports = router;