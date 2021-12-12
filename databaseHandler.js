const mysql = require("mysql");
const dotenv = require(`dotenv`).config();

//Create database object using data from .ENV file
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

//Connect to database
db.connect(err => {
    if (err) {
        console.error(err);
    }
});

//Query's the database and returns a promise until the value is settled
function queryDB(sql, params) { 
    return new Promise((resolve, reject) => {
      db.query(sql, params, (err, result) => {
        if (err) {
            reject(err);
        } 
        resolve(result);
      });
    });
  }

module.exports.db = db;
module.exports.queryDB = queryDB;