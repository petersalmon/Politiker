const mongoConnection = require("mongoose");
require("dotenv/config");

// Connect to Mongo DB 
mongoConnection.connect(process.env.MONGODB_CONNECTION, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        server: { 
            socketOptions: { 
              keepAlive: 300000, connectTimeoutMS: 30000 
            } 
        }, 
          replset: { 
            socketOptions: { 
              keepAlive: 300000, 
              connectTimeoutMS : 30000 
            } 
        }
    },
    function(){
        console.log("You are now connected to the Mongoose database!");
    }
);

module.exports = mongoConnection;