const mongoConnection = require("mongoose");
require("dotenv/config");

// Connect to Mongo DB 
mongoConnection.connect(process.env.MONGODB_CONNECTION, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    function(){
        console.log("You are now connected to the Mongoose database!");
    }
);

module.exports = mongoConnection;