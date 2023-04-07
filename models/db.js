const mysql = require('mysql');
const dbConfig = require("../config/db.config.js");


let connection = mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
});

function query(sql, values, callback) {
    connection.query(sql, values, (err, results, fields) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results);
    });
}

module.exports = { query };



