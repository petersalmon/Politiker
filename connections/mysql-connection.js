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

function initializeConnection(config) {
    function addDisconnectHandler(connection) {
        connection.on("error", function (error) {
            if (error instanceof Error) {
                if (error.code === "PROTOCOL_CONNECTION_LOST") {
                    console.error(error.stack);
                    console.log("Lost connection. Reconnecting...");

                    initializeConnection(connection.config);
                } else if (error.fatal) {
                    throw error;
                }
            }
        });
    }

    var connection = mysql.createConnection(config);

    // Add handlers.
    addDisconnectHandler(connection);

    connection.connect();
    return connection;
}

var connection = initializeConnection({
    host: "us-cdbr-east-02.cleardb.com",
    user: "b085f4726117c1",
    password: process.env.HEROKU_MYSQL_PASSWORD,
    database: "heroku_47ea31f06bc3e94",
    multipleStatements: true
});

function handleDisconnect(connection) {
    connection.on('error', function(err) {
      if (!err.fatal) {
        return;
      }
  
      if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
        throw err;
      }
  
      console.log('Re-connecting lost connection: ' + err.stack);
  
      connection = mysql.createConnection(connection.config);
      handleDisconnect(connection);
      connection.connect();
    });
}
  
handleDisconnect(connection);


module.exports = mysqlConnection;