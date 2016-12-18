var express = require('express');
var User = require('../models/user');


/* sign check. */
module.exports.post = function(req, res) {
    var user = new User(req.body);
    user.find()
    .then(function(result){
        req.session.userid = result[0].id;
        req.session.role = result[0].role;
        res.json({ state: 'ok' });
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

};