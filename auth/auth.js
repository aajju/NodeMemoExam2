/**
 * Created by aajju on 2017-03-02.
 */
var jwt = require('jsonwebtoken');
const secretKey = 'secret_key';
const expiredLater = 60 * 60 * 24 *1000;

module.exports.generateToken = function (email) {
    var iat = Date.now();

    var token = jwt.sign({
        iat: iat,
        exp: iat + expiredLater,
        emai: email
    }, secretKey);

        return token;

};

module.exports.verifyToken = function (token, callback) {
    jwt.verify(token, 'shhhhh', function(err, decoded) {
        if (err) {
            return callback(false, err);
        } else {
            var iat = Date.now();

            if (iat > decoded.exp) {
                return callback(false, '토큰이 만료되었습니다!')
            }

            return callback(true, null);
        }
    });
}