const mongoConnection = require("mongoose");
require("dotenv/config");

// // Connect to Mongo DB 
// mongoConnection.connect(process.env.MONGODB_CONNECTION, 
//     {
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//     },
//     function(){
//         console.log("You are now connected to the Mongoose database!");
//     }
// );

const db = process.env.MONGODB_CONNECTION;

const mongoConnection = async () => {
    try {
      await mongoose.connect(db, {
        useUnifiedTopology: true,
        useNewUrlParser: true
      });
      console.log("You are now connected to the Mongoose database!");
    } catch (err) {
        console.error("Something went wrong! Connection to the Mongoose database failed.");
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = mongoConnection;