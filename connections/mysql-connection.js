const mysql = require("mysql");
require("dotenv/config");

// var mysqlConnection = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: process.env.MYSQL_PASSWORD,
//     database: "nyc",
//     multipleStatements: true
// });

// mysqlConnection.connect(function(err){
//     if(err){
//         console.log(err);
//     }
//     else{
//         console.log("You are now connected to the nyc MySQL database!");
//     }
// });

// var mysqlConnection

//  mysqlConnection = mysql.createConnection({
//     host: "us-cdbr-east-02.cleardb.com",
//     user: "b085f4726117c1",
//     password: process.env.HEROKU_MYSQL_PASSWORD,
//     database: "heroku_47ea31f06bc3e94",
//     multipleStatements: true
// });

const mysqlConnection = mysql.createPool({
    host: "us-cdbr-east-02.cleardb.com",
    user: "b085f4726117c1",
    password: process.env.HEROKU_MYSQL_PASSWORD,
    database: "heroku_47ea31f06bc3e94",
    multipleStatements: true
});

module.exports = mysqlConnection;