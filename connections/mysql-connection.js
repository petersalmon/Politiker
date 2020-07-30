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

// module.exports = mysqlConnection;

var mysqlConnection = mysql.createConnection({
    host: "us-cdbr-east-02.cleardb.com",
    user: "b085f4726117c1",
    password: process.env.HEROKU_MYSQL_PASSWORD,
    database: "heroku_47ea31f06bc3e94",
    multipleStatements: true
});

function handleDisconnect() {
  var connection = mysqlConnection // Recreate the connection, since
                                // the old one cannot be reused.

  connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();


module.exports = mysqlConnection;