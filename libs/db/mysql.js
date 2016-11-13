var mysql = require('mysql');
var Promise = require('es6-promise').Promise;
//var async = require('async');

var pool =  mysql.createPool({
             host     : 'localhost',
             user     : 'admin',
             password : '1q2w3e4r5Z',
             port     : 3306,
             database : 'dotask',
             connectionLimit: 100
         });

exports.query = function(sql, props) {
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (err, connection) {
            connection.query(
            sql, props,
            function (err, res) {
                if (err) reject(err);
            else resolve(res);
            }
            );
            connection.release();
        });
    });
};
