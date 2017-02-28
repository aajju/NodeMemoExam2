/**
 * Created by aajju on 2017-02-28.
 */


var pool = require('../config/databaseConfiguration').pool;
/**
 * Node.js 의 대부분의 기능들은 철저한 비동기 방식으로 구현됩니다.
 *
 * 마지막 파라미터 보시면 callback ==> 콜백메소드
 */

module.exports.duplicateCheck = function (email, callback) {
    const sql = "SELECT * FROM member WHERE email = ?";

    // Connection Pool 에서 Connection 을 가져온다.
    pool.getConnection(function (err, connection) {
        if (err) {
            // errorMessage, result
            // getConnection 에서 error 예외가 발생한 경우는, 주로 계정정보가 틀리거나 db가 죽어있을 때
            callback("DbError", null);
            // 사용한 Connection 객체를 Connection pool에 반환한다
            connection.release();
        } else {
            // 실제 DB에 쿼리 날리는 부분
            // 첫번째 파라미터 (고정) : SQL 문
            // 두번째 파라미터 (가변) : 배열로 선언을 하는데, SQL문에서 ?의 개수만큼 값을 넣어 줘야 문제가 생기지 않는다.  없으면 안씀
            // 세번째 파라미터 (고정) : 콜백 메소드로서 err, rows 씀.  err(예외 관련 객체), rows(쿼리 결과 객체) mySQL모듈에서 알아서 보내줌
            connection.query(sql, email, function (err, rows) {
                // 쿼리를 날렸는데 예외가 발생한 경우는  쿼리문 자체에 문제가 있을때
                if (err) {
                    callback("SQLError", null);
                    connection.release();
                } else {
                    // 이 메소드 자체가 중복체크 메소드 이기 때문에,, 중복 체크를 통과 했다~~ 트루,,  못했다  false
                    if (rows.length == 0 || rows == null) {
                        callback(null, true);
                        connection.release();
                    } else {
                        callback(null, false);
                        connection.release();
                    }
                }
            })
        }
    })
};

module.exports.join = function (email, password, callback) {
    const sql = "INSERT INTO member (email, password) VALUES (?,?)";

    pool.getConnection(function (err, connection) {
        if (err){
            callback("DbError", null);
            connection.release();
        } else {
            connection.query(sql, [email, password], function (err, rows) {
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

module.exports.login = function (email, password, callback) {
  const sql = "SELECT * FROM member WHERE email = ? AND password = ?";

  pool.getConnection(function (err, connection) {
      if(err){
          callback("DbError", null);
          connection.release();
      } else {
          connection.query(sql, [email, password], function (err, rows) {
              if(err){
                  callback("SqlError", null);
                  connection.release();
              } else {
                  if (rows.length == 0 || rows == null){
                      callback(null, false);
                      connection.release();
                  } else {
                      callback(null, true);
                      connection.release();
                  }
              }
          })
      }
  })
};