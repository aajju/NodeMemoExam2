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

module.exports.getMemoList = function (callback) {
    const sql = "SELECT id, title, contents, UNIX_TIMESTAMP(time) as time FROM memo";

    pool.getConnection(function (err, connection) {
        if (err) {
            callback("DbError", null);
            connection.release();
        } else {
            connection.query(sql, function (err, rows) {
                if (err) {
                    callback("SqlError", null);
                    connection.release();
                } else  {
                    if (rows.length == 0 || rows == null) {
                        callback("Empty", null);
                        connection.release();
                    } else {
                        let resultList = [];

                        for (let i = 0 ; i < rows.length; i++){
                            let each = rows[i];
                            resultList.push({id: each.id, title: each.title, contents : each.contents, time: each.time});
                        }

                        callback(null, resultList);
                        connection.release();
                    }
                }
            })
        }
    })
};

module.exports.deleteMemo = function (id, callback) {
    const sql = "DELETE FROM memo WHERE id = ?";

    pool.getConnection(function (err, connection) {
        if(err){
            callback("DbError", null);
            connection.release();
        } else {
            connection.query(sql, [id], function (err, rows) {
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

module.exports.updateMemo = function (id, title, contents, callback) {
    const sql ="UPDATE memo SET title = ?, contents = ?, time = now() WHERE id = ?";

    pool.getConnection(function (err, connection) {
        if(err){
            callback("DbError", null);
            connection.release();
        } else {
            connection.query(sql, [title, contents, id], function (err, rows) {
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





