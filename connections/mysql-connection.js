const mysql = require("mysql");
require("dotenv/config");

const mysqlConnection = mysql.createPool({
    host: "us-cdbr-east-02.cleardb.com",
    user: "b085f4726117c1",
    password: process.env.HEROKU_MYSQL_PASSWORD,
    database: "heroku_47ea31f06bc3e94",
    multipleStatements: true
});

module.exports = mysqlConnection;