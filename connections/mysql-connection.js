const mysql = require("mysql");
require("dotenv/config");

var mysqlConnection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.MYSQL_PASSWORD,
    database: "nyc",
    multipleStatements: true
});

mysqlConnection.connect(function(err){
    if(err){
        console.log(err);
    }
    else{
        console.log("You are now connected to the nyc MySQL database!");
    }
});

module.exports = mysqlConnection;