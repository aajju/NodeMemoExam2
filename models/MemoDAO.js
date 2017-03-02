/**
 * Created by aajju on 2017-03-01.
 */

var pool = require('../config/databaseConfiguration').pool;

module.exports.insert = function (title, contents, callback) {
    const sql = "INSERT INTO memo (title, contents, time) VALUES (?,?,now())";

    pool.getConnection(function (err, connection) {
        if(err){
            callback("DbError", null);
            connection.release();
        } else {
            connection.query(sql, [title, contents], function (err, rows) {
                if(err){
                    callback("SqlError", null);
                    connection.release();
                } else{
                    callback(null, true);
                    connection.release();
                }
            })
        }
    })
};

