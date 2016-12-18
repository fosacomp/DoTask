var express = require('express');

module.exports.get = function(req, res) {
    req.session.destroy();
    res.redirect('/');
};