const mysql = require("mysql");
require("dotenv/config");

const dbConnectionInfo = {
    host: "us-cdbr-east-02.cleardb.com",
    user: "b085f4726117c1",
    password: process.env.HEROKU_MYSQL_PASSWORD,
    database: "heroku_47ea31f06bc3e94",
    multipleStatements: true
}

var dbconnection = mysql.createPool(
    dbConnectionInfo
); 

// Attempt to catch disconnects 
dbconnection.on('connection', function (connection) {

    console.log('Database Connection established');
  
    connection.on('error', function (err) {
      console.error(new Date(), 'MySQL error', err.code);
    });
    
    connection.on('close', function (err) {
      console.error(new Date(), 'MySQL close', err);
    });
  
});

module.exports = mysqlConnection;