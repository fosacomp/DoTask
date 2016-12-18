var crypto = require('crypto');
var userSQL = require('../sql/user');
var db = require('../libs/db/mysql');

User = function(user) {
    this.name = user.name;
    this.pwd = user.pwd;
    this.email = user.email;
    this.role = user.role;
};

User.prototype.constructor = User;

User.prototype.find = function(){
    var pwd = this.pwd;
    return db.query(userSQL.get, [this.name])
    .then(function(res){
        if(res) {
            var hashed = res[0].pwd;
            var salt = res[0].salt;
            var check = checkPassword(hashed, salt, pwd);
            if(check)
                return res;
            else
                throw new Error('Ошибка логина/пароля');;
        }
        else throw new Error('Ошибка выполнения запроса userSQL.get');;
    });
};

User.prototype.add = function (){
    var salt = getSalt();
    var pwd = encryptPassword (this.pwd, salt);
    var params = { name: this.name, pwd: pwd, email: this.email, role: this.role, salt: salt };
    return db.query(userSQL.add, params);
}

function getSalt() {
    return crypto.randomBytes(32).toString('hex');
};

function encryptPassword (pwd, salt) {
    return crypto.createHmac('sha1', salt).update(pwd).digest('hex');
};

function checkPassword(hashed, salt, pwd) {
    return encryptPassword(pwd, salt) === hashed;
};

module.exports = User;