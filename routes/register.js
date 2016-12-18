/**
 * Created by macspirit on 17.11.16.
 */
var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* sign check. */
router.post('/', function(req, res) {
    var user = new User(req.body);
    user.add()
        .then(function(){
            res.json({state: 'ok'});
    });

    // if (sess.views) {
    //     sess.views++
    //     res.setHeader('Content-Type', 'text/html')
    //     res.write('<p>views: ' + sess.views + '</p>')
    //     res.write('<p>expires in: ' + (sess.cookie.maxAge / 1000) + 's</p>')
    //     res.end()
    // } else {
    //     sess.views = 1
    //     res.end('welcome to the session demo. refresh!')
    // }
});

module.exports = router;